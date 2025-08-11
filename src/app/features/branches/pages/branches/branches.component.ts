import { Component, OnInit } from '@angular/core';
import {
  GridApi,
  ColDef,
  GetContextMenuItemsParams,
  GetContextMenuItems,
  CellClickedEvent,
  CellValueChangedEvent,
} from 'ag-grid-community';
import { Store } from '@ngxs/store';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';

import { Branches } from '../../models/Branches';
import {
  LoadBranches,
  CreateBranch,
  UpdateBranch,
  SoftDeleteBranch,
  AddTemporaryBranchRow,
} from '../../state/branch.actions';
import { BranchesState } from '../../state/branch.state';

import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { SaveButtonRendererComponent } from '../../../../shared/component/save-button-renderer/save-button-renderer.component';

@Component({
  selector: 'app-branches',
  standalone: false,
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.css',
})
export class BranchesComponent implements OnInit {
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;
  SaveButtonRendererComponent = SaveButtonRendererComponent;

  gridApi!: GridApi;
  rowData: Branches[] = [];

  columnDefs: ColDef<Branches>[] = [
    {
      field: 'Name',
      headerName: 'Branch Name',
      flex: 2,
      minWidth: 200,
      editable: true,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'Province',
      headerName: 'Province',
      flex: 1,
      minWidth: 150,
      editable: true,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'Country',
      headerName: 'Country',
      flex: 1,
      minWidth: 200,
      editable: true,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      flex: 1,
      minWidth: 150,
      cellRenderer: 'activeToggleRenderer',
      editable: false,
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      pinned: 'right',
      maxWidth: 90,
      sortable: false,
      filter: false,
      cellRenderer: 'saveButtonRenderer',
      editable: false,
      onCellClicked: (params: CellClickedEvent) => this.saveRow(params.data),
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      pinned: 'right',
      maxWidth: 100,
      sortable: false,
      filter: false,
      cellRenderer: 'softDeleteRenderer',
      editable: false,
      onCellClicked: (params: CellClickedEvent) => this.softDelete(params.data),
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
  };

  constructor(
    private store: Store,
    private toaster: ToastrService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadBranches()).subscribe({
      error: (err) => {
        this.logger.logError(err, 'BranchesComponent.ngOnInit');
        this.toaster.show('Failed to load branches', 'error');
      },
    });

    this.store.select(BranchesState.getBranches).subscribe({
      next: (data) => {
        this.rowData = data
          .filter((b) => !b.IsDelete)
          .sort((a, b) => (b.BranchId ?? 0) - (a.BranchId ?? 0)); // newest first
      },
    });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
  const editableFields = ['Name', 'Province', 'Country'];

  if (editableFields.includes(event.colDef.field || '')) {
    const row = event.data;
    row.isEdited = true;
    this.gridApi.applyTransaction({ update: [row] });
  }
}


 saveRow(row: Branches): void {
  const isNew = !row.BranchId;

  const trimmed: Branches = {
    ...row,
    Name: row.Name?.trim() || '',
    Province: row.Province?.trim() || '',
    Country: row.Country?.trim() || '',
    IsActive: row.IsActive ?? true,
    IsDelete: row.IsDelete ?? false,
  };

  // ⛔️ Validate empty fields before saving
  if (!trimmed.Name || !trimmed.Province || !trimmed.Country) {
    this.toaster.show('Name, Province, and Country are required.', 'warning');
    return;
  }

  if (!isNew && !row.isEdited) {
    this.toaster.show('No changes to save.', 'info');
    return;
  }

  const action = isNew
    ? new CreateBranch(trimmed)
    : new UpdateBranch(row.BranchId!, trimmed);

  this.store.dispatch(action).subscribe({
    next: () => {
      this.toaster.show('Saved successfully', 'success');
      row.isEdited = false;
      this.gridApi.applyTransaction({ update: [row] });
    },
    error: (err) => {
      this.toaster.show('Failed to save branch', 'error');
      this.logger.logError(err, 'BranchesComponent.saveRow');
    },
  });
}


  softDelete(row: Branches): void {
    row.IsDelete = true;

    // Remove from view
    this.rowData = this.rowData.filter((r) => r.BranchId !== row.BranchId);

    this.store.dispatch(new SoftDeleteBranch(row)).subscribe({
      next: () => this.toaster.show('Deleted successfully', 'success'),
      error: (err) => {
        this.toaster.show('Failed to delete branch', 'error');
        this.logger.logError(err, 'BranchesComponent.softDelete');
      },
    });
  }

  addRow(): void {
    const hasUnsaved = this.rowData.some((b) => b.BranchId === 0);
    if (hasUnsaved) {
      this.toaster.show(
        'Please save the new row before adding another.',
        'info'
      );
      return;
    }

    const newRow: Branches = {
      BranchId: 0,
      Name: '',
      Province: '',
      Country: '',
      IsActive: true,
      IsDelete: false,
    };

    // Prepend new row to rowData
    this.rowData = [newRow, ...this.rowData];

    // Immediately show it in the grid
    this.gridApi.applyTransaction({ add: [newRow], addIndex: 0 });

    // Optional: track it in the state if necessary
    this.store.dispatch(new AddTemporaryBranchRow(newRow));
  }

  getContextMenuItems: GetContextMenuItems = (
    params: GetContextMenuItemsParams
  ) => [
    {
      name: 'Add Row',
      action: () => this.addRow(),
      icon: '<i class="fas fa-plus"></i>',
    },
    {
      name: 'Delete Row',
      action: () => params.node && this.softDelete(params.node.data),
      icon: '<i class="fas fa-trash"></i>',
    },
    {
      name: 'Save Row',
      action: () => params.node && this.saveRow(params.node.data),
      icon: '<i class="fas fa-save"></i>',
    },
    'separator',
    'copy',
    'export',
  ];

  getRowClass = (params: any): string =>
    !params.data.BranchId ? 'temporary-row' : '';
}