import { Component } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-complaints',
  standalone: false,
  templateUrl: './complaints.component.html',
  styleUrl: './complaints.component.css'
})
export class ComplaintsComponent {

 private gridApi!: GridApi;

selectedComplaint: string | null = null;

 complaintOptions: string[] = ['Damaged Item', 'Late Delivery', 'Wrong Product'];

  columnDefs: ColDef[] = [
    {
      headerName: 'Log Date',
      field: 'logDate',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Username',
      field: 'username',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Description',
      field: 'description',
      sortable: true,
      filter: true,
      flex: 2,
    },
    {
      headerName: 'Delete',
      cellRenderer: () => {
        return `<i class="fa fa-trash delete-icon" style="color: red; cursor: pointer;"></i>`;
      },
      width: 100,
      cellStyle: { textAlign: 'center', verticalAlign: 'middle' },
    },
  ];

  defaultColDef: ColDef = {
    headerClass: 'bold-header',
    sortable: true,
    filter: true,
    resizable: true,
    cellStyle: {
      borderRight: '1px solid #ccc',
    },
  };

  rowData: any[] = []; // ✅ Keep it empty

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  printPage(): void {
    window.print();
  }
}

