import { Component, OnInit } from '@angular/core';
import {
  CellClickedEvent,
  ColDef,
  GetContextMenuItems,
  GetContextMenuItemsParams,
  GridApi,
} from 'ag-grid-community';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { Vehicle } from '../../models/Vehicle';
import { Store } from '@ngxs/store';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import {
  AddVehicleRowLocally,
  LoadVehicles,
  SoftDeleteVehicle,
  UpdateVehicle,
} from '../../state/vehicle.actions';
import { VehicleState } from '../../state/vehicle.state';
import { Branches } from '../../../branches/models/Branches';
import { LoadBranches } from '../../../branches/state/branch.actions';
import { BranchesState } from '../../../branches/state/branch.state';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';
import { SaveButtonRendererComponent } from '../../../../shared/component/save-button-renderer/save-button-renderer.component';

@Component({
  selector: 'app-vehicle',
  standalone: false,
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css',
})
export class VehicleComponent implements OnInit {
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;
  SaveButtonRendererComponent = SaveButtonRendererComponent;

  gridApi!: GridApi;
  rowData: Vehicle[] = [];
  branches: Branches[] = [];

  columnDefs: ColDef<Vehicle>[] = [
    {
      field: 'RegNumber',
      headerName: 'RegNumber',
      editable: true,
      flex: 2,
      minWidth: 200,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'Description',
      headerName: 'Description',
      editable: true,
      flex: 1,
      minWidth: 200,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'Branch',
      headerName: 'Branch',
      editable: true,
      flex: 1,
      minWidth: 150,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: () => ({
        values: this.branches.map((b) => b.Name),
      }),
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
      editable: true,
      flex: 1,
      minWidth: 150,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      flex: 1,
      minWidth: 120,
      cellRenderer: 'activeToggleRenderer',
      cellStyle: {
        display: 'flex',
        justifyContent: 'center',
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },

    {
      suppressHeaderMenuButton:true,
      pinned: 'right',
      sortable: false,
      filter: false,
      flex: 1,
      maxWidth: 90,
      cellRenderer: 'saveButtonRenderer',
      onCellClicked: (params: CellClickedEvent) => this.saveRow(params.data),
      cellStyle: {
        display: 'flex',
        justifyContent: 'center',
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },
    {
      suppressHeaderMenuButton:true,
      pinned: 'right',
      sortable: false,
      filter: false,
      flex: 1,
      maxWidth: 100,
      cellRenderer: 'softDeleteRenderer',
      onCellClicked: (params: CellClickedEvent) => this.softDelete(params.data),
      cellStyle: {
        display: 'flex',
        justifyContent: 'center',
        borderRight: '1px solid #ccc',
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
    this.store.dispatch(new LoadVehicles());
    this.store.dispatch(new LoadBranches());

    this.store.select(VehicleState.getVehicles).subscribe({
      next: (data) => (this.rowData = data),
    });

    this.store.select(BranchesState.getBranches).subscribe({
      next: (data) => (this.branches = data),
    });

    this.store.select(VehicleState.getVehicles).subscribe({
      next: (data) => (this.rowData = data),
    });
  }

  setBranchAndRelatedFields(params: any): boolean {
    const newBranch = (params.newValue || '').trim().toLowerCase();
    const oldBranch = (params.oldValue || '').trim().toLowerCase();

    if (newBranch === oldBranch) return false;

    const selected = this.branches.find(
      (b) => b.Name.trim().toLowerCase() === newBranch
    );

    if (selected) {
      params.data.Branch = selected.Name;
      params.data.Province = selected.Province;
      params.data.isEdited = true;

      return true;
    }

    return false;
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
  }

  onCellValueChanged(event: any): void {
    const row = event.data;
    row.isEdited = true;
    this.gridApi.applyTransaction({ update: [row] });
  }

  saveRow(row: Vehicle): void {
    const isNew = !row.RegNumber;

    const trimmed = {
      RegistrationNumber: row.RegNumber,
      Description: row.Description?.trim(),
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
      .dispatch(new UpdateVehicle(row.RegNumber!, payload))
      .subscribe({
        next: () => {
          this.toaster.show('Saved successfully', 'success');
          row.isEdited = false;
          this.gridApi.applyTransaction({ update: [row] });
        },
        error: (err) => {
          this.toaster.show('Failed to save', 'error');
          this.logger.logError(err, 'VehicleComponent.saveRow');
        },
      });
  }

  softDelete(row: Vehicle): void {
    const updated = { ...row, isDeleted: true };
    this.store.dispatch(new SoftDeleteVehicle(updated)).subscribe({
      next: () => this.toaster.show('Deleted successfully', 'success'),
      error: (err) => {
        this.toaster.show('Failed to delete', 'error');
        this.logger.logError(err, 'VehicleComponent.softDelete');
      },
    });
  }

  addRow(): void {
    const newRow: Vehicle = {
      VehicleId: 0,
      RegNumber: 0,
      Description: '',
      Branch: '',
      Province: '',
      Country: '',
      IsActive: true,
      isDeleted: false,
      isEdited: true,
    };
    this.store.dispatch(new AddVehicleRowLocally(newRow));
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
    'separator',
    'copy',
    'export',
  ];

  getRowClass = (params: any) =>
    !params.data.RegistrationNumber ? 'temporary-row' : '';
}
