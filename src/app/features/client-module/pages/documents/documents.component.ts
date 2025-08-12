import { Component } from '@angular/core';
import {
  CellClickedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { Documents } from '../../../documents/models/Documents';
import { DocumentsService } from '../../../documents/services/documents.service';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { FileLinkRendererComponent } from '../../../../shared/component/file-link-renderer/file-link-renderer.component';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';
import { UnlinkCellRendererComponent } from '../../../../shared/component/unlink-cell-renderer/unlink-cell-renderer.component';
import { LinkedDocumentsService } from '../../services/linkdocumetns/link-documents.service';
import { ClientDocument } from '../../models/Client';
import { TabStateService } from '../../services/tab-state-service/tab-state.service';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';

@Component({
  selector: 'app-documents',
  standalone: false,
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
})
export class DocumentsComponent {
  // rows shown in the grid (we hide soft-deleted)
  rows: ClientDocument[] = [];
  private gridApi!: GridApi;

  // link-popup visibility
  showPopup = false;

  // map renderer names used in columnDefs -> Angular components
  UnlinkCellRendererComponent = UnlinkCellRendererComponent;
  FileLinkRendererComponent = FileLinkRendererComponent;

  // UI-only master list + lookup map (NOT stored in state)
  private allDocs: Documents[] = [];
  private docById = new Map<number, Documents>();

  // If you use string-based renderers, expose components for the template:
  // <ag-grid-angular ... [components]="components"></ag-grid-angular>
  components = {
    fileLinkRenderer: FileLinkRendererComponent,
    unlinkCellRenderer: UnlinkCellRendererComponent,
  };

  // columns: show name via master lookup (no DTO on row)
  columnDefs: ColDef<ClientDocument>[] = [
    {
      headerName: 'Document',
      // ✅ Use DocumentId -> master map to get Description
      valueGetter: (p) => this.docById.get(p.data?.DocumentId ?? 0)?.Description ?? '',
      flex: 2,
      minWidth: 350,
      sortable: true,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'ListRank',
      headerName: 'Rank',
      sortable: true,
      flex: 1,
      minWidth: 200,
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      headerName: 'File',
      field: 'FileName',
      cellRenderer: 'fileLinkRenderer',
      flex: 1,
      minWidth: 350,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      suppressHeaderMenuButton: true,
      pinned: 'right',
      sortable: false,
      filter: false,
      flex: 1,
      maxWidth: 110,
      cellRenderer: 'unlinkCellRenderer',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
      onCellClicked: (params: CellClickedEvent<ClientDocument>) => {
        const row = params.data;
        if (!row) return;
        this.softDelete(row);
      },
    },
  ];

  // default column behavior
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
  };

  constructor(
    private toastr: ToastrService,
    private tabState: TabStateService,
    private docsSvc: DocumentsService // <-- inject to load master names
  ) { }

  ngOnInit(): void {
    // 1) Load master docs (for name lookup)
    this.loadMasterDocs().then(() => {
      // 2) Bind state rows (hide soft-deleted)
      this.tabState.documents$.subscribe((docs) => {
        this.rows = (docs ?? []).filter((d) => !d.IsDeleted);
        if (this.gridApi) this.gridApi.setGridOption('rowData', this.rows);
        // if names came late, refresh cells
        if (this.gridApi) this.gridApi.refreshCells({ force: true });
      });
    });
  }

  onGridReady(e: GridReadyEvent) {
    this.gridApi = e.api;
    this.gridApi.setGridOption('rowData', this.rows);
    this.autoSizeColumnsBasedOnContent();
  }

  onFitColumns() {
    if (!this.gridApi) return;
    const defs = this.gridApi.getColumnDefs() ?? [];
    const fields = defs
      .map((d) => (d as ColDef).field)
      .filter((f): f is string => !!f);
    const toFit = fields.filter((f) => !['FileName'].includes(f));
    if (toFit.length) this.gridApi.autoSizeColumns(toFit, false);
  }

  autoSizeColumnsBasedOnContent() {
    if (!this.gridApi) return;
    this.gridApi.autoSizeColumns(['ListRank', 'FileName'], false);
  }

  // mark as deleted in state; keep for save payload, just hide in UI
  softDelete(row: ClientDocument): void {
    this.tabState.softDeleteDocument(
      (d) => d.ClientDocumentId === row.ClientDocumentId && d.DocumentId === row.DocumentId
    );
    this.toastr.show('Removed successfully', 'success');
  }

  // when a new ClientDocument is linked from popup
  onDocumentLinked(newDoc: ClientDocument & { Document?: any }): void {
    // strip DTO if present to keep state/POST clean
    const { Document, ...pure } = newDoc as any;
    this.tabState.addDocument(pure as ClientDocument);
    this.toastr.show('Document linked successfully', 'success');
  }

  // --- master names loader (UI-only) ---
  private loadMasterDocs(): Promise<void> {
    return new Promise((resolve) => {
      this.docsSvc.getAll().subscribe({
        next: (list) => {
          this.allDocs = list ?? [];
          this.docById.clear();
          for (const d of this.allDocs) {
            if (d?.DocumentId != null) this.docById.set(d.DocumentId, d);
          }
          resolve();
        },
        error: () => {
          this.toastr.show('Failed to load document names', 'error');
          resolve(); // don’t block; cells will just show empty name
        },
      });
    });
  }
}
