import { Component, OnInit } from '@angular/core';
import { CaseDetails } from '../../models/CaseDetails';
import {
  CellClickedEvent,
  ColDef,
  GridApi,
  ICellRendererParams,
} from 'ag-grid-community';
import { ActiveToggleRendererComponent } from '../../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { CaseService } from '../../services/case-service/case.service';
import { Router } from '@angular/router';
import { CaseDataService } from '../../services/case-data-service/case-data.service';
import { agDateValueFormatter } from '../../../../../shared/utils/date-utils';

@Component({
  selector: 'app-case',
  standalone: false,
  templateUrl: './case.component.html',
  styleUrl: './case.component.css',
})
export class CaseComponent implements OnInit {
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;

  call: CaseDetails[] = [];
  gridApi!: GridApi;

  columnDefs: ColDef<CaseDetails>[] = [
    {
      field: 'CaseStatus',
      headerName: 'Status',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'CaseReferenceNumber',
      headerName: 'Case Reference Number',
      filter: 'agTextColumnFilter',
      minWidth: 250,
      flex: 1,
      cellRenderer: (params: ICellRendererParams) =>
        `<a style="color:blue;cursor:pointer;text-decoration:underline;">${params.value}</a>`,
      onCellClicked: (event: CellClickedEvent) => {
        const selectedCall = event.data;
        this.caseDataService.setSelectedCase(selectedCall);

        const queryParams = {
          callRef: selectedCall.CaseReferenceNumber,
          callerName: `${selectedCall.callerFirstName} ${selectedCall.callerLastName}`,
          client: selectedCall.client,
        };

        this.router.navigate(['/cases/case-details'], { queryParams });
      },

      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'CaseNumber',
      headerName: 'Case Number ',
      filter: 'agTextColumnFilter',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'CaseCreatedDate',
      headerName: 'Case Date',
      filter: 'agTextColumnFilter',
      minWidth: 230,
      flex: 2,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
      valueFormatter: agDateValueFormatter,
    },
    {
      field: 'CaseCaller',
      headerName: 'Caller Name',
      filter: 'agTextColumnFilter',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
      //Adding dummy data logic to display caller name
      valueGetter: (params) => {
        const caller = params.data?.CaseCaller;
        return caller ? `${caller.FirstName} ${caller.LastName}` : 'Unknown';
      },
    },
    {
      field: 'DeceasedName',
      headerName: 'Deceasced Name',
      filter: 'agTextColumnFilter',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'ClientId',
      headerName: 'Client',
      filter: 'agTextColumnFilter',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'Type',
      headerName: 'Type',
      filter: 'agTextColumnFilter',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'FuneralDate',
      headerName: 'Funeral Date',
      filter: 'agTextColumnFilter',
      minWidth: 230,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
      valueFormatter: agDateValueFormatter,
    },
    // Adding Case Completed Date and Case Opened Date fields but now i am commetting them out
    // as they are not required in the current view
    // {
    //   field: 'CaseCompletedDate',
    //   headerName: 'Case Completed Date',
    //   filter: 'agTextColumnFilter',
    //   minWidth: 230,
    //   flex: 1,
    //   valueFormatter: agDateValueFormatter,
    //   cellStyle: { borderRight: '1px solid #ccc' },
    //   headerClass: 'bold-header',
    // },
    // {
    //   field: 'CaseOpenedDate',
    //   headerName: 'Case Opened Date',
    //   filter: 'agTextColumnFilter',
    //   minWidth: 230,
    //   flex: 1,
    //   valueFormatter: agDateValueFormatter,
    //   cellStyle: { borderRight: '1px solid #ccc' },
    //   headerClass: 'bold-header',
    // },
  ];

  defaultColDef: ColDef = { sortable: true, filter: true, resizable: true };

  constructor(
    private caseService: CaseService,
    private router: Router,
    private caseDataService: CaseDataService
  ) {}

  /* === lifecycle === */
  ngOnInit(): void {
    this.loadUsers();
  }

  resizeGrid(): void {
    if (this.gridApi) {
      setTimeout(() => this.gridApi.sizeColumnsToFit(), 100);
    }
  }
  // This is actual logic but i am committing it out  to display the dummy data
  // loadUsers(): void {
  //   this.caseService.getAllCases().subscribe((data) => {
  //     this.call = data;
  //     this.resizeGrid();
  //   });
  // }

  // Dummy data for testing purposes for demo only
  loadUsers(): void {
    this.caseService.getAllCases().subscribe((data) => {
      // Inject dummy values for missing fields
      this.call = data.map((caseItem) => ({
        ...caseItem,
        CaseCaller: caseItem.CaseCaller || {
          FirstName: 'John',
          LastName: 'Doe',
        },
        DeceasedName: caseItem.DeceasedName || 'Sample Deceased Name',
        Type: caseItem.Type || 'Standard',
        FuneralDate: caseItem.FuneralDate || '2025-06-23',
      }));

      this.resizeGrid();
    });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.resizeGrid();
  }

  onRowClicked(event: any): void {
    const call: CaseDetails = event.data;

    // Optionally store full call object in service
    this.caseDataService.setSelectedCase(call);

    const queryParams = {
      callRef: call.CaseReferenceNumber,
      callerName: `${call.CaseCaller} `,
      client: call.ClientId, // Assuming ClientId is the client identifier
    };

    this.router.navigate(['/cases/case-details'], { queryParams });
  }

  onFitColumns(): void {
    this.gridApi?.sizeColumnsToFit();
  }

  onGridSizeChanged(event: any): void {
    this.onFitColumns();
  }
}
