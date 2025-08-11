import { Component, OnInit } from '@angular/core';
import {
  CellClickedEvent,
  CellValueChangedEvent,
  ColDef,
  GetContextMenuItems,
  GetContextMenuItemsParams,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { ServiceProviderTypes } from '../../models/ServiceProviderTypes';
import { ServiceProviderTypesService } from '../../services/serviceProvider-types/service-provider-types.service';
import { ActiveToggleRendererComponent } from '../../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { ToastrService } from '../../../../../shared/component/toastr/services/toastr.service';
import { Store } from '@ngxs/store';
import { LoggerService } from '../../../../../core/services/logger/logger.service';
import { LoadServiceProviderTypes } from '../../../state/service-provider-types.actions';
import { ServiceProviderTypesState } from '../../../state/service-provider-types.state';
import { SaveButtonRendererComponent } from '../../../../../shared/component/save-button-renderer/save-button-renderer.component';
@Component({
  selector: 'app-service-providers-types',
  standalone: false,
  templateUrl: './service-providers-types.component.html',
  styleUrl: './service-providers-types.component.css',
})
export class ServiceProvidersTypesComponent implements OnInit {
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;
  SaveButtonRendererComponent = SaveButtonRendererComponent;

  rows: ServiceProviderTypes[] = [];
  private gridApi!: GridApi;

  columnDefs: ColDef<ServiceProviderTypes>[] = [
    {
      field: 'ServiceProviderCode',
      headerName: 'Code',
      editable: true,
      sortable: true,
      flex: 1,
      minWidth: 100,
      cellEditor: 'agTextCellEditor',
      valueFormatter: (params) => params.value || 'Enter Code',
      cellClassRules: { 'hint-text': (params) => !params.value },
      cellStyle: { borderRight: '1px solid #ccc', textAlign: 'center' },
      headerClass: 'bold-header',
    },
    {
      field: 'Description',
      headerName: 'Description',
      editable: true,
      sortable: true,
      flex: 2,
      minWidth: 200,
      cellEditor: 'agTextCellEditor',
      valueFormatter: (params) => params.value || 'Enter Description',
      cellClassRules: { 'hint-text': (params) => !params.value },
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      flex: 1,
      minWidth: 90,
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

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  constructor(
    private store: Store,
    private spSvc: ServiceProviderTypesService,
    private toastrService: ToastrService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadServiceProviderTypes());
    this.store.select(ServiceProviderTypesState.getAll).subscribe({
      next: (data) => {
        // Show only rows where IsDeleted is false or null
        this.rows = data.filter((item) => !item.IsDelete);
      },
      error: (err) => {
        this.logger.logError(err, 'ServiceProvidersTypesComponent.loadData');
        this.toastrService.show('Failed to load data.', 'error');
      },
    });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
  }

  onFitColumns(): void {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  addRow(): void {
    const hasUnsaved = this.rows.some((r) => r.ServiceProviderTypeId === 0);
    if (!hasUnsaved) {
      const newRow: ServiceProviderTypes = {
        ServiceProviderTypeId: 0,
        ServiceProviderCode: '',
        Description: '',
        IsActive: true,
        IsDelete: false,
      };
      this.rows = [newRow, ...this.rows];
    } else {
      this.toastrService.show(
        'Please save the new row before adding another.',
        'info'
      );
    }
  }

  saveRow(row: ServiceProviderTypes): void {
    const isNew = !row.ServiceProviderTypeId || row.ServiceProviderTypeId === 0;
    const code = row.ServiceProviderCode?.trim();
    const desc = row.Description?.trim();

    if (!code || !desc) {
      this.toastrService.show('Please fill in all required fields.', 'info');
      return;
    }

    row.ServiceProviderCode = code;
    row.Description = desc;
    row.IsDelete = row.IsDelete ?? false; // ✅ Ensure it's never undefined

    if (isNew) {
      const payload: ServiceProviderTypes = {
        ServiceProviderTypeId: 0,
        ServiceProviderCode: code,
        Description: desc,
        IsActive: row.IsActive ?? true,
        IsDelete: false, // ✅ explicitly include this
      };

      this.spSvc.create(payload).subscribe({
        next: (created) => {
          this.toastrService.show('Created successfully!', 'success');

          const index = this.rows.findIndex(
            (r) => r.ServiceProviderTypeId === 0
          );
          if (index !== -1) {
            this.rows[index] = { ...created };
          }

          created.isEdited = false;
          this.gridApi.applyTransaction({ update: [created] });
          this.rows = [...this.rows];
        },
        error: () => {
          this.toastrService.show('Creation failed', 'error');
        },
      });
    } else if (row.isEdited) {
      const { isEdited, IsDelete, ...sanitized } = row;

      // Ensure only `IsDelete` is sent, not `IsDeleted`
      (sanitized as any).IsDelete = IsDelete ?? false;

      this.spSvc.update(row.ServiceProviderTypeId!, sanitized).subscribe({
        next: () => {
          this.toastrService.show('Updated successfully!', 'success');
          row.isEdited = false;

          this.gridApi.applyTransaction({ update: [row] });
          this.rows = this.rows.map((r) =>
            r.ServiceProviderTypeId === row.ServiceProviderTypeId
              ? { ...row }
              : r
          );
        },
        error: () => {
          this.toastrService.show('Update failed', 'error');
        },
      });
    } else {
      this.toastrService.show('No changes to save.', 'info');
    }
  }

  softDelete(row: ServiceProviderTypes): void {
    // ✅ Mark deleted first
    row.IsDelete = true;

    // ✅ Remove from view immediately
    this.rows = this.rows.filter((r) => !r.IsDelete);
    this.rows = [...this.rows];

    // ✅ Sync full object to backend if it's an existing row
    if (row.ServiceProviderTypeId && row.ServiceProviderTypeId > 0) {
      const payload: ServiceProviderTypes = {
        ServiceProviderTypeId: row.ServiceProviderTypeId,
        ServiceProviderCode: row.ServiceProviderCode,
        Description: row.Description,
        IsActive: row.IsActive,
        IsDelete: true,
      };

      this.spSvc.softDeleteServiceProviderType(payload).subscribe({
        next: () => this.toastrService.show('Deleted Successfully', 'success'),
        error: () => this.toastrService.show('Delete Failed', 'error'),
      });
    }
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    const row = event.data;
    const code = row.ServiceProviderCode?.trim(); // ✅ fixed typo from ServiceProvideCode
    const desc = row.Description?.trim();

    if (!code || !desc) {
      this.toastrService.show('Fill all required fields.', 'info');
      return;
    }

    row.ServiceProviderCode = code;
    row.Description = desc;

    // ✅ preserve IsDeleted when editing
    if (row.ServiceProviderTypeId && row.ServiceProviderTypeId > 0) {
      row.isEdited = true;
    }

    this.gridApi.applyTransaction({ update: [{ ...row }] });
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
}
