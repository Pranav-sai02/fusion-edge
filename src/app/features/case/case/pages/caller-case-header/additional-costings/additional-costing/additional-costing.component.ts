import { Component, HostListener } from '@angular/core';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AdditionalCost } from '../model/model';
import { SoftDeleteButtonRendererComponent } from '../../../../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';

@Component({
  selector: 'app-additional-costing',
  standalone: false,
  templateUrl: './additional-costing.component.html',
  styleUrl: './additional-costing.component.css'
})
export class AdditionalCostingComponent {

private gridApi!: GridApi;

  showAddModal = false;

  rowData: AdditionalCost[] = [];

  columnDefs: ColDef<AdditionalCost>[] = [
    {
      headerName: 'Cost',
      field: 'Cost',
      width: 160,
      cellClass: 'cell-bordered',
      valueFormatter: p =>
        (p.value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    },
    {
      headerName: 'Description',
      field: 'Description',
      flex: 1,
      minWidth: 260,
      cellClass: 'cell-bordered',
    },
    {
      headerName: 'Delete',
      pinned: 'right' as const,
      sortable: false,
      filter: false,
      width: 90,
      cellRenderer: SoftDeleteButtonRendererComponent,
      onCellClicked: (e: CellClickedEvent<AdditionalCost>) => {
        if (!e.data) return;
        this.deleteRow(e.data);
      },
      cellClass: 'cell-centered cell-bordered',
      headerClass: 'bold-header',
    },
  ];

  defaultColDef: ColDef = { resizable: true, sortable: true, filter: true };

  onGridReady(e: GridReadyEvent) { this.gridApi = e.api; this.fit(); }
  @HostListener('window:resize') onResize() { this.fit(); }
  private fit() { setTimeout(() => this.gridApi?.sizeColumnsToFit(), 0); }

  openAddModal() { this.showAddModal = true; }
  closeAddModal() { this.showAddModal = false; }

  onAdd(payload: { cost: number; description: string }) {
    const nextId = this.rowData.length
      ? Math.max(...this.rowData.map(r => r.AdditionalCostId)) + 1
      : 1;

    const newRow = new AdditionalCost(nextId, payload.cost, payload.description.trim());
    this.rowData = [...this.rowData, newRow];

    this.closeAddModal();
    this.fit();
  }

  deleteRow(row: AdditionalCost) {
    this.rowData = this.rowData.filter(r => r.AdditionalCostId !== row.AdditionalCostId);
  }

    printPage(): void {
    throw new Error('Method not implemented.');
  }

}
