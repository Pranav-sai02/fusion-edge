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
import { Store } from '@ngxs/store';
import {
  AddDocument,
  LoadDocuments,
  SoftDeleteDocument,
  UpdateDocument,
} from '../../state/documents.actions';
import { DocumentsState } from '../../state/documents.state';

import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { Documents } from '../../models/Documents';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';
import { SaveButtonRendererComponent } from '../../../../shared/component/save-button-renderer/save-button-renderer.component';
import { LoggerService } from '../../../../core/services/logger/logger.service';

@Component({
  selector: 'app-documents',
  standalone: false,
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
})
export class DocumentsComponent implements OnInit {
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;
  SaveButtonRendererComponent = SaveButtonRendererComponent;

  gridApi!: GridApi;
  rowData: Documents[] = [];

  defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
  };

  columnDefs: ColDef<Documents>[] = [
    {
      field: 'Description',
      headerName: 'Description',
      editable: true,
      flex: 3,
      minWidth: 250,
      cellEditor: 'agTextCellEditor',
      valueFormatter: (params) => params.value || 'Enter Description',
      cellClassRules: { 'hint-text': (params) => !params.value },
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      cellRenderer: 'activeToggleRenderer',
      minWidth: 100,
      cellStyle: { textAlign: 'center', borderRight: '1px solid #ccc' },
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
      onCellClicked: (params: CellClickedEvent<Documents>) => {
        if (params.data) this.saveRow(params.data);
      },
      cellStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRight: '1px solid #ccc',
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
      onCellClicked: (params: CellClickedEvent<Documents>) => {
        if (params.data) this.softDeleteRow(params.data);
      },
      minWidth: 100,
      cellStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },
  ];

  constructor(
    private store: Store,
    private toasterService: ToastrService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadDocuments());
    this.store.select(DocumentsState.getDocuments).subscribe((data) => {
      this.rowData = data
        .filter((d) => !d.IsDelete)
        .sort((a, b) => (b.DocumentId ?? 0) - (a.DocumentId ?? 0)); // newest first
    });
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  onCellValueChanged(event: CellValueChangedEvent<Documents>): void {
    const updatedRow = event.data;
    const index = this.rowData.findIndex(
      (r) => r === updatedRow || r.DocumentId === updatedRow.DocumentId
    );

    if (index > -1) {
      this.rowData[index].IsEdited = true;
      this.gridApi.applyTransaction({ update: [this.rowData[index]] });
    }
  }

  saveRow(row: Documents): void {
    const isComplete = row.Description?.trim() && row.IsActive !== undefined;

    if (!isComplete) {
      this.toasterService.show(
        'Please complete all fields before saving.',
        'warning'
      );
      return;
    }

    const isNew = !row.DocumentId;

    if (!isNew && !row.IsEdited) {
      this.toasterService.show('No changes to save.', 'info');
      return;
    }

    if (isNew) {
      this.store.dispatch(new AddDocument(row));
    } else {
      this.store.dispatch(new UpdateDocument(row));
    }

    this.toasterService.show('Saved successfully!', 'success');
    row.IsEdited = false;
    this.gridApi.applyTransaction({ update: [row] });
  }

  softDeleteRow(row: Documents): void {
    row.IsDelete = true;

    this.rowData = this.rowData.filter((r) => !r.IsDelete);

    this.rowData = [...this.rowData];

    const payload: Documents = {
      DocumentId: row.DocumentId,
      Description: row.Description,
      IsActive: row.IsActive,
      IsDelete: true,
    };
    this.store.dispatch(new SoftDeleteDocument(payload)).subscribe({
      next: () => this.toasterService.show('Deleted successfully', 'success'),
      error: (err) => {
        this.toasterService.show('Failed to delete branch', 'error');
        this.logger.logError(err, 'DocumentsComponent.softDelete');
      },
    });
  }

  addRow(): void {
    const newRow: Documents = {
      DocumentId: 0,
      Description: '',
      IsActive: true,
      IsDelete: false,
    };
    this.rowData = [newRow, ...this.rowData];
    this.gridApi.applyTransaction({ add: [newRow] });
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
        action: () => {
          if (params.node?.data) this.softDeleteRow(params.node.data);
        },
        icon: '<i class="fas fa-trash"></i>',
      },
      'separator',
      'copy',
      'export',
    ];
  };
}