import { Component, OnInit } from '@angular/core';
import {
  GridApi,
  ColDef,
  GetContextMenuItems,
  GetContextMenuItemsParams,
  MenuItemDef,
  CellClickedEvent,
} from 'ag-grid-community';
import { Store } from '@ngxs/store';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { BodyLocations } from '../../models/BodyLocations';
import {
  LoadBodyLocations,
  UpdateBodyLocation,
  SoftDeleteBodyLocation,
  AddBodyLocationRowLocally,
} from '../../state/body-locations.actions';
import { BodyLocationsState } from '../../state/body-locations.state';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { SaveButtonRendererComponent } from '../../../../shared/component/save-button-renderer/save-button-renderer.component';
import { BodyLocationsService } from '../../services/body-locations.service';

@Component({
  selector: 'app-body-locations',
  standalone: false,
  templateUrl: './body-locations.component.html',
  styleUrls: ['./body-locations.component.css'],
})
export class BodyLocationsComponent implements OnInit {
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;
  SaveButtonRendererComponent = SaveButtonRendererComponent;

  gridApi!: GridApi;
  rowData: BodyLocations[] = [];

  columnDefs: ColDef<BodyLocations>[] = [
    {
      field: 'BodyLocationCode',
      headerName: 'Body Location Code',
      flex: 1,
      minWidth: 150,
      editable: true,
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'Description',
      headerName: 'Description',
      flex: 2,
      minWidth: 200,
      editable: true,
      cellStyle: {
        borderRight: '1px solid #ccc',
      },
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
      suppressHeaderMenuButton: true,
      pinned: 'right',
      sortable: false,
      filter: false,
      flex: 1,
      maxWidth: 90,
      cellRenderer: 'saveButtonRenderer',
      editable: false,
      onCellClicked: (params: CellClickedEvent) => {
        if (params?.data) {
          this.saveRow(params.data);
        }
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
    private logger: LoggerService,
    private bodyLocationsService: BodyLocationsService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadBodyLocations()).subscribe({
      error: (err: any) => {
        this.logger.logError(err, 'BodyLocationsComponent.ngOnInit');
        this.toaster.show('Failed to load body locations', 'error');
      },
    });

   this.store.select(BodyLocationsState.getBodyLocations).subscribe({
  next: (data: BodyLocations[]) => {
    this.rowData = data.filter((item) => !item.IsDelete); // ✅ Exclude soft deleted
  },
});
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
  }

 onCellValueChanged(event: any): void {
  const editableFields = ['BodyLocationCode', 'Description'];

  if (editableFields.includes(event.colDef.field || '')) {
    const row = event.data;
    row.IsEdited = true;
    this.gridApi.applyTransaction({ update: [row] });
  }
}


  saveRow(row: BodyLocations): void {
    const isNew = !row.BodyLocationId || row.BodyLocationId === 0;

    const trimmed = {
      BodyLocationCode: row.BodyLocationCode?.trim(),
      Description: row.Description?.trim(),
      IsActive: row.IsActive,
      IsDelete: false,
    };

    if (!trimmed.BodyLocationCode || !trimmed.Description) {
      this.toaster.show('Code and Description are required.', 'warning');
      return;
    }

    const payload: BodyLocations = { ...row, ...trimmed };

    if (isNew) {
      this.bodyLocationsService.addBodyLocation(payload).subscribe({
        next: (created: BodyLocations) => {
          this.toaster.show('Created successfully', 'success');
          row.BodyLocationId = created.BodyLocationId;
          row.IsEdited = false;
          this.gridApi.applyTransaction({ update: [row] });

          this.store.dispatch(new LoadBodyLocations());
        },
        error: (err: any) => {
          this.toaster.show('Failed to create body location', 'error');
          this.logger.logError(err, 'BodyLocationsComponent.saveRow[POST]');
        },
      });
    } else {
      if (!row.IsEdited) {
        this.toaster.show('No changes to save.', 'info');
        return;
      }

      this.store
        .dispatch(new UpdateBodyLocation(row.BodyLocationId, payload))
        .subscribe({
          next: () => {
            this.toaster.show('Updated successfully', 'success');
            row.IsEdited = false;
            this.gridApi.applyTransaction({ update: [row] });
          },
          error: (err: any) => {
            this.toaster.show('Failed to update', 'error');
            this.logger.logError(err, 'BodyLocationsComponent.saveRow[PUT]');
          },
        });
    }
  }

  softDelete(row: BodyLocations): void {
    const updated = { ...row, IsDelete: true };
    this.store.dispatch(new SoftDeleteBodyLocation(updated));
  }

  addRow(): void {
    const newRow: BodyLocations = {
      BodyLocationId: 0,
      BodyLocationCode: '',
      Description: '',
      IsActive: true,
      IsDelete: false,
      IsEdited: true,
    };
    this.store.dispatch(new AddBodyLocationRowLocally(newRow));
  }

  getContextMenuItems: GetContextMenuItems = (
    params: GetContextMenuItemsParams
  ) => {
    const addRow: MenuItemDef = {
      name: 'Add Row',
      action: () => this.addRow(),
      icon: '<i class="fas fa-plus"></i>',
    };

    const deleteRow: MenuItemDef = {
      name: 'Delete Row',
      action: () => {
        if (params.node) {
          this.softDelete(params.node.data);
        }
      },
      icon: '<i class="fas fa-trash"></i>',
    };

    return [addRow, deleteRow, 'separator', 'copy', 'export'];
  };

  getRowClass = (params: any): string =>
    !params.data.BodyLocationId ? 'temporary-row' : '';
}