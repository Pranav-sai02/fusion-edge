import { Component } from '@angular/core';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import {
  CellClickedEvent,
  CellValueChangedEvent,
  ColDef,
  GetContextMenuItems,
  GetContextMenuItemsParams,
  GridApi,
} from 'ag-grid-community';
import { ClientGroup } from '../../models/ClientGroup';
import { Store } from '@ngxs/store';
import { ClientGroupService } from '../../services/client-group-services/client-group.service';

import {
  AddClientGroup,
  LoadClientGroups,
} from '../../client-group-state/client-group.action';
import { ClientGroupState } from '../../client-group-state/client-group.state';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';
import { SaveButtonRendererComponent } from '../../../../shared/component/save-button-renderer/save-button-renderer.component';

@Component({
  selector: 'app-client-group',
  standalone: false,
  templateUrl: './client-group.component.html',
  styleUrl: './client-group.component.css',
})
export class ClientGroupComponent {
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;
  SaveButtonRendererComponent = SaveButtonRendererComponent;

  gridApi!: GridApi;
  rowData: ClientGroup[] = [];

  columnDefs: ColDef<ClientGroup>[] = [
    {
      field: 'Name',
      headerName: 'Name',
      sortable: true,
      flex: 2,
      minWidth: 200,
      editable: true,
      cellEditor: 'agTextCellEditor',
      valueFormatter: (params) => (params.value ? params.value : 'Enter Name'),
      cellClassRules: {
        'hint-text': (params) => !params.value,
      },
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      cellRenderer: 'activeToggleRenderer',
      flex: 1,
      minWidth: 120,
      headerClass: 'bold-header',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    {
      suppressHeaderMenuButton: true,
      pinned: 'right',
      sortable: false,
      filter: false,
      flex: 1,
      maxWidth: 90,
      cellRenderer: 'saveButtonRenderer',
      onCellClicked: (params: CellClickedEvent<ClientGroup>) => {
        if (params.data) this.saveRow(params.data);
      },
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      suppressHeaderMenuButton: true,
      pinned: 'right',
      sortable: false,
      filter: false,
      flex: 1,
      maxWidth: 100,
      cellRenderer: 'softDeleteRenderer',
      onCellClicked: (params: CellClickedEvent) =>
        this.softDeleteProvider(params.data),
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
  ];

  constructor(
    private store: Store,
    private clientGroupService: ClientGroupService,
    private toasterService: ToastrService
  ) {}

  defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
  };

  ngOnInit(): void {
    this.store.dispatch(new LoadClientGroups());
    this.store.select(ClientGroupState.getClientGroups).subscribe((data) => {
      // 🧹 Filter out soft-deleted rows
      this.rowData = data.filter((group) => !group.IsDeleted);
    });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    const updatedRow = event.data;
    const index = this.rowData.findIndex(
      (r) => r === updatedRow || r.ClientGroupId === updatedRow.ClientGroupId
    );

    if (index > -1) {
      this.rowData[index].IsEdited = true;
      this.gridApi.applyTransaction({ update: [this.rowData[index]] });
    }
  }

  saveRow(row: ClientGroup): void {
    const isComplete =
      row.Name &&
      row.Name.trim() !== '' &&
      row.IsActive !== null &&
      row.IsActive !== undefined;

    if (!isComplete) {
      this.toasterService.show(
        'Please complete all fields before saving.',
        'warning'
      );
      return;
    }

    //  Strict validation: only letters and spaces
    const isValidName = /^[A-Za-z\s]+$/.test(row.Name.trim());
    if (!isValidName) {
      this.toasterService.show(
        'Name can contain only letters and spaces. No numbers or special characters.',
        'error'
      );
      return;
    }

    // 🔁 Duplicate check (case-insensitive, excluding self if editing)
    // const duplicate = this.rowData.find(
    //   (r) =>
    //     r.Name.trim().toLowerCase() === row.Name.trim().toLowerCase() &&
    //     r.ClientGroupId !== row.ClientGroupId
    // );

    // if (duplicate) {
    //   this.toasterService.show('Client Group Name already exists.', 'warning');
    //   return;
    // }

    const isNew = !row.ClientGroupId;

    if (!isNew && !row.IsEdited) {
      this.toasterService.show('No changes to save.', 'info');
      return;
    }

    const saveObservable = isNew
      ? this.clientGroupService.addClientGroup(row)
      : this.clientGroupService.updateClientGroup(row);

    saveObservable.subscribe({
      next: (savedRow: ClientGroup) => {
        this.toasterService.show('Saved successfully!', 'success');

        if (isNew && savedRow?.ClientGroupId) {
          row.ClientGroupId = savedRow.ClientGroupId;
        }

        row.IsEdited = false;
        this.gridApi.applyTransaction({ update: [row] });

        this.store.dispatch(new LoadClientGroups());
        setTimeout(() => this.gridApi.redrawRows(), 100);
      },
      error: () => {
        this.toasterService.show('Failed to save. Try again.', 'error');
      },
    });
  }

  getRowClass = (params: any) => {
    return !params.data.ClientGroupId ? 'temporary-row' : '';
  };

  softDeleteProvider(clientGroup: ClientGroup): void {
    const updatedClientGroup: ClientGroup = {
      ...clientGroup,
      IsDeleted: true,
    };

    this.clientGroupService.updateClientGroup(updatedClientGroup).subscribe({
      next: () => {
        this.toasterService.show('Deleted successfully!', 'success');

        // Remove from UI
        this.rowData = this.rowData.filter(
          (group) => group.ClientGroupId !== clientGroup.ClientGroupId
        );
        this.rowData = [...this.rowData];

        // Reload from store to get clean state
        this.store.dispatch(new LoadClientGroups());
      },
      error: () => {
        this.toasterService.show('Delete failed. Try again.', 'error');
      },
    });
  }

  addRow(): void {
    const newRow: ClientGroup = {
      Name: '',
      IsActive: true,
    };
    this.store.dispatch(new AddClientGroup(newRow));
  }

  getContextMenuItems: GetContextMenuItems = (
    params: GetContextMenuItemsParams
  ) => {
    const addRow = {
      name: 'Add Row',
      action: () => this.addRow(),
      icon: '<i class="fas fa-plus"></i>',
    };

    const deleteRow = {
      name: 'Delete Row',
      action: () => {
        if (params.node) {
          this.softDeleteProvider(params.node.data);
        }
      },
      icon: '<i class="fas fa-trash"></i>',
    };

    return [addRow, deleteRow, 'separator', 'copy', 'export'];
  };
}
