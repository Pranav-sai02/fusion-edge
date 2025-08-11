import { Component, OnInit } from '@angular/core';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { AreaCodes } from '../../models/AreaCodes';
import { AreaCodesService } from '../../services/areacodes/area-codes.service';
import {
  CellValueChangedEvent,
  ColDef,
  GetContextMenuItems,
  GetContextMenuItemsParams,
  GridApi,
  ICellRendererParams,
} from 'ag-grid-community';
import {
  AddAreaCodeRowLocally,
  LoadAreaCodes,
  SoftDeleteAreaCode,
  UpdateAreaCode,
} from '../../state/area-code.actions';
import { Store } from '@ngxs/store';
import { AreaCodesState } from '../../state/area-code.state';

import { LoggerService } from '../../../../core/services/logger/logger.service';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';

@Component({
  selector: 'app-area-codes',
  standalone: false,
  templateUrl: './area-codes.component.html',
  styleUrl: './area-codes.component.css',
})
export class AreaCodesComponent implements OnInit {
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;
  gridApi!: GridApi;

  rowData: AreaCodes[] = [];

  columnDefs: ColDef<AreaCodes>[] = [
    {
      field: 'AreaCode',
      headerName: 'Code',
      sortable: true,
      editable: true,
      flex: 1,
      minWidth: 200,
      cellEditor: 'agTextCellEditor',
      valueFormatter: (params) =>
        params.value ? params.value : 'Enter Areacode',
      cellClassRules: {
        'hint-text': (params) => !params.value,
      },
      cellStyle: { borderRight: '1px solid #ccc', textAlign: 'center' },
      headerClass: 'bold-header',
    },
    {
      field: 'Description',
      headerName: 'Description',
      sortable: true,
      flex: 2,
      minWidth: 200,
      editable: true,
      cellEditor: 'agTextCellEditor',
      valueFormatter: (params) =>
        params.value ? params.value : 'Enter Country/Region',
      cellClassRules: {
        'hint-text': (params) => !params.value,
      },
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'Type',
      headerName: 'Type',
      sortable: true,
      flex: 1,
      minWidth: 180,
      editable: true,
      // cellEditor: 'agSelectCellEditor',
      cellEditor: 'agRichSelectCellEditor',
      cellEditorParams: {
        values: ['Landline', 'Mobile', 'International'],
      },
      valueFormatter: (params) => (params.value ? params.value : 'Select Type'),
      cellClassRules: {
        'hint-text': (params) => !params.value,
      },
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
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },

    {
      headerName: 'Delete',
      // field: 'isDeleted',
      flex: 1,
      minWidth: 100,
      cellRenderer: 'softDeleteRenderer',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
      onCellClicked: (params: any) => this.softDeleteProvider(params.data),
    },
    {
      headerName: 'Save',
      flex: 1,
      minWidth: 120,
      cellRenderer: () => {
        return `
    <style>
      .save-icon-btn:hover .save-icon {
        transform: scale(1.2) ;
      }
    </style>
    <button
      class="save-icon-btn"
      style="
        background-color: white;
        color: #333;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 14px;
        font-size: 1rem;
        gap: 8px;
        cursor: pointer;
      "
    >
      <i class="fas fa-save save-icon" style="color: #28a745; font-size: 1.2rem; transition: transform 0.3s ease;"></i>
    </button>
  `;
      },

      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
      onCellClicked: (params: any) => {
        this.saveRow(params.data);
      },
    },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  constructor(
    private store: Store,
    private areaCodesService: AreaCodesService,
    private toasterService: ToastrService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadAreaCodes());
    this.store.select(AreaCodesState.getAreaCodes).subscribe({
      next: (data) => {
        this.rowData = data;
      },
      error: (error) => {
        this.logger.logError(error, 'AreaCodesComponent.ngOnInit');
        this.toasterService.show('Failed to load area codes.', 'error');
      },
    });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    const row = event.data;

    // Null check to avoid calling .trim() on undefined
    const newValue = row.AreaCode?.trim();

    // If AreaCode is empty, don't proceed
    if (!newValue) {
      row.AreaCode = ''; // Clear invalid value
      row.isEdited = true;
      this.gridApi.applyTransaction({ update: [row] });
      return;
    }

    // Save original value if not already saved
    if (!row.originalAreaCode) {
      row.originalAreaCode = newValue;
    }

    row.AreaCode = newValue; // Save trimmed value back
    row.isEdited = true;
    this.gridApi.applyTransaction({ update: [row] });
  }

  saveRow(row: AreaCodes): void {
    const isNew = !row.AreaCodeId;

    const trimmedCode = row.AreaCode?.trim() ?? '';
    const trimmedDesc = row.Description?.trim() ?? '';
    const isComplete =
      trimmedCode && trimmedDesc && row.Type && row.IsActive !== null;

    // if (!isComplete) {
    //   alert('Please complete all required fields before saving.');
    //   return;
    // }
    if (!isNew && !row.isEdited) {
      this.toasterService.show('No changes to save.', 'info');
      return;
    }

    // Add trailing space for backend compatibility
    row.AreaCode = trimmedCode;
    row.Description = trimmedDesc;

    if (isNew) {
      this.areaCodesService.addAreaCode(row).subscribe({
        next: () => {
          this.toasterService.show('Saved successfully!', 'success');
          row.isEdited = false;
          this.gridApi.applyTransaction({ update: [row] });
          this.store.dispatch(new LoadAreaCodes());
        },
        error: (err) => {
          alert('Error saving area code.');
          this.toasterService.show('Error Saving Area Code ', 'error');
          console.error(err);
        },
      });
    } else {
      const areaCodeId = row.AreaCodeId;

      // 🔥 Clean row: remove internal-only frontend fields
      const {
        AreaCodeId,
        isEdited,
        originalAreaCode,
        isDeleted,
        ...sanitizedRow
      } = row;

      this.areaCodesService
        .updateAreaCode(areaCodeId!, sanitizedRow)
        .subscribe({
          next: () => {
            // alert('Updated successfully!');
            this.toasterService.show('Updated successfully!', 'success');
            row.isEdited = false;
            delete row.originalAreaCode; // Remove originalAreaCode after save

            this.gridApi.applyTransaction({ update: [row] });
          },
          error: (err) => {
            this.toasterService.show('Error updating area code.', 'error');
            console.error(err);
          },
        });
    }
  }

  getRowClass = (params: any) => {
    // If AreaCodeId is not present, it's a newly added temporary row
    return !params.data.AreaCodeId ? 'temporary-row' : '';
  };

  softDeleteProvider(areaCode: AreaCodes): void {
    const updatedAreaCode = { ...areaCode, isDeleted: true };
    this.store.dispatch(new SoftDeleteAreaCode(updatedAreaCode)).subscribe({
      next: () => {
        this.toasterService.show('Removed Successfully', 'success');
      },
      error: (err) => {
        this.toasterService.show('Error Removing  area code.', 'error');
        console.error(err);
      },
    });
  }

  addRow(): void {
    const newRow: AreaCodes = {
      // AreaCodeId: 0,
      AreaCode: '',
      Description: '',
      Type: 'Landline',
      IsActive: true,

      // isDeleted: false,
    };
    this.store.dispatch(new AddAreaCodeRowLocally(newRow));
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
