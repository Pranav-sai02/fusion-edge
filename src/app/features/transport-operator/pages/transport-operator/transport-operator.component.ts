import { Component, OnInit } from '@angular/core';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import {
  CellClickedEvent,
  ColDef,
  GetContextMenuItems,
  GetContextMenuItemsParams,
  GridApi,
} from 'ag-grid-community';
import { TransportOperator } from '../../models/TransportOperator';
import { Store } from '@ngxs/store';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import {
  LoadTransportOperators,
  UpdateTransportOperator,
  AddTransportOperatorRowLocally,
  SoftDeleteTransportOperator,
} from '../../state/transport-operator.actions';
import { TransportOperatorState } from '../../state/transport-operator.state';
import { Branches } from '../../../branches/models/Branches';
import { LoadBranches } from '../../../branches/state/branch.actions';
import { BranchesState } from '../../../branches/state/branch.state';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';
import { SaveButtonRendererComponent } from '../../../../shared/component/save-button-renderer/save-button-renderer.component';

@Component({
  selector: 'app-transport-operator',
  standalone: false,
  templateUrl: './transport-operator.component.html',
  styleUrl: './transport-operator.component.css',
})
export class TransportOperatorComponent implements OnInit {
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;
  SaveButtonRendererComponent = SaveButtonRendererComponent;

  gridApi!: GridApi;
  rowData: TransportOperator[] = [];
  branches: Branches[] = [];

  columnDefs: ColDef<TransportOperator>[] = [];
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
    // First load branches
    this.store.dispatch(new LoadBranches()).subscribe(() => {
      this.store.selectOnce(BranchesState.getBranches).subscribe((data) => {
        this.branches = data;
        this.initializeColumnDefs(); // Build columnDefs after branches loaded
      });
    });

    // Load transport operators
    this.store.dispatch(new LoadTransportOperators());

    this.store.select(TransportOperatorState.getTransportOperators).subscribe({
      next: (data) => (this.rowData = data),
    });
  }

  initializeColumnDefs(): void {
    this.columnDefs = [
      {
        field: 'Name',
        headerName: 'Name',
        editable: true,
        flex: 2,
        cellStyle: { borderRight: '1px solid #ccc' },
        headerClass: 'bold-header',
      },
      {
        field: 'Branch',
        headerName: 'Branch',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: this.branches.map((b) => b.Name),
        },
        valueSetter: (params) => this.setBranchAndRelatedFields(params),
        cellStyle: { borderRight: '1px solid #ccc' },
        headerClass: 'bold-header',
      },
      {
        field: 'Province',
        headerName: 'Province',
        editable: false,
        flex: 1,
        minWidth: 150,
        cellStyle: { borderRight: '1px solid #ccc' },
        headerClass: 'bold-header',
      },
      {
        field: 'Country',
        headerName: 'Country',
        editable: false,
        flex: 1,
        minWidth: 160,
        cellStyle: { borderRight: '1px solid #ccc' },
        headerClass: 'bold-header',
      },
      {
        field: 'IsActive',
        headerName: 'Active',
        flex: 1,
        minWidth: 150,
        cellRenderer: 'activeToggleRenderer',
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
        maxWidth: 90,
        cellRenderer: 'saveButtonRenderer',
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
        suppressHeaderMenuButton: true,
        pinned: 'right',
        sortable: false,
        filter: false,
        flex: 1,
        maxWidth: 100,
        cellRenderer: 'softDeleteRenderer',
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
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
  }

  onCellValueChanged(event: any): void {
    const row = event.data;
    row.isEdited = true;
    this.gridApi.applyTransaction({ update: [row] });
  }

  setBranchAndRelatedFields(params: any): boolean {
    const newBranchName = (params.newValue || '').trim().toLowerCase();
    const selectedBranch = this.branches.find(
      (b) => b.Name.trim().toLowerCase() === newBranchName
    );

    if (!selectedBranch) return false;

    params.data.Branch = selectedBranch.Name;
    params.data.Province = selectedBranch.Province;
    params.data.isEdited = true;

    return true; // tells AG Grid to update the cell
  }

  saveRow(row: TransportOperator): void {
    const isNew = !row.TransportOperatorId;
    const trimmed = {
      Name: row.Name?.trim(),
      Branch: row.Branch?.trim(),
      Province: row.Province?.trim(),
      Country: row.Country?.trim(),
      IsActive: row.IsActive,
    };

    if (!isNew && !row.isEdited) {
      this.toaster.show('No changes to save.', 'info');
      return;
    }

    const payload = { ...row, ...trimmed };

    this.store
      .dispatch(new UpdateTransportOperator(row.TransportOperatorId!, payload))
      .subscribe({
        next: () => {
          this.toaster.show('Saved successfully', 'success');
          row.isEdited = false;
          this.gridApi.applyTransaction({ update: [row] });
        },
        error: (err) => {
          this.toaster.show('Failed to save', 'error');
          this.logger.logError(err, 'TransportOperatorComponent.saveRow');
        },
      });
  }

  softDelete(row: TransportOperator): void {
    const updated = { ...row, isDeleted: true };
    this.store.dispatch(new SoftDeleteTransportOperator(updated)).subscribe({
      next: () => this.toaster.show('Deleted successfully', 'success'),
      error: (err) => {
        this.toaster.show('Failed to delete', 'error');
        this.logger.logError(err, 'TransportOperatorComponent.softDelete');
      },
    });
  }

  addRow(): void {
    const newRow: TransportOperator = {
      Name: '',
      Branch: '',
      Province: '',
      Country: '',
      IsActive: true,
    };
    this.store.dispatch(new AddTransportOperatorRowLocally(newRow));
  }

  getContextMenuItems: GetContextMenuItems = (
    params: GetContextMenuItemsParams
  ) => {
    return [
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
      'separator',
      'copy',
      'export',
    ];
  };

  getRowClass = (params: any) =>
    !params.data.TransportOperatorId ? 'temporary-row' : '';
}
