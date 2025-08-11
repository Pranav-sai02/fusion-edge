import { Component } from '@angular/core';
import { CellClickedEvent, ColDef, GridApi, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { Client } from '../../models/Client';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { ClientService } from '../../services/client-services/client.service';

import { ViewButtonRendererComponent } from '../../../../shared/component/view-button-renderer/view-button-renderer.component';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';

@Component({
  selector: 'app-client',
  standalone: false,
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {

  gridApi!: GridApi;
  clients: Client[] = [];

  selectedClient: Client | null = null;
  showPopup = false;

  gridOptions: GridOptions = {
    context: { componentParent: this },
    getRowId: (params) => params.data?.ClientId?.toString(),
    pagination: true,
    paginationPageSize: 20,
    domLayout: 'autoHeight',
    animateRows: true,
    rowSelection: 'single',
  };

  columnDefs: ColDef<Client>[] = [
    {
      field: 'ClientName',
      headerName: 'Name',
      flex: 1,
      minWidth: 200,
      filter: 'agTextColumnFilter',
      cellStyle: { borderRight: '1px solid #ccc' },
    },
    {
      field: 'ClaimsManager',
      headerName: 'Claims Manager',
      flex: 2,
      minWidth: 200,
      filter: 'agTextColumnFilter',
      cellStyle: { borderRight: '1px solid #ccc' },
    },
    {
      field: 'ClientGroup',
      valueGetter: (params) => params.data?.ClientGroup?.Name ?? '',
      headerName: 'Group',
      flex: 1,
      minWidth: 200,
      filter: 'agTextColumnFilter',
      cellStyle: { borderRight: '1px solid #ccc' },
    },
    {
      field: 'Address',
      headerName: 'Address',
      flex: 1,
      minWidth: 200,
      cellStyle: {
        'white-space': 'nowrap',
         overflow: 'hidden',
        'text-overflow': 'ellipsis',
        'border-right': '1px solid #ccc',
      },
    },

    {
      field: 'Tel',
      headerName: 'Telephone',
      flex: 1,
      minWidth: 200,
      cellStyle: { textAlign: 'center', borderRight: '1px solid #ccc' },
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      flex: 1,
      minWidth: 200,
      cellRenderer: 'activeToggleRenderer',
      cellRendererParams: (params: ICellRendererParams<Client>) => {
        return {
          isDisabled: true,
        };
      },
      cellStyle: {
        textAlign: 'center',
        borderRight: '1px solid #ccc',
      },
    },
    {
      suppressHeaderMenuButton: true,
      pinned: 'right',
      sortable: false,
      filter: false,
      maxWidth: 90,
      cellRenderer: 'viewButtonRenderer',
      cellStyle: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '17px',
        borderRight: '1px solid #ccc',
      },
      onCellClicked: (params: CellClickedEvent) => this.editClient(params.data),
    },
    {
      suppressHeaderMenuButton: true,
      pinned: 'right',
      sortable: false,
      filter: false,
      maxWidth: 100,
      cellRenderer: 'softDeleteRenderer',
      cellStyle: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRight: '1px solid #ccc',
      },
      onCellClicked: (params: CellClickedEvent) => this.softDelete(params.data),
    },
  ];

  defaultColDef: ColDef = {
    headerClass: 'bold-header',
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100,
  };

  components = {
    activeToggleRenderer: ActiveToggleRendererComponent,
    softDeleteRenderer: SoftDeleteButtonRendererComponent,
    viewButtonRenderer: ViewButtonRendererComponent,
  };

  constructor(
    private clientService: ClientService,
    private toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.resizeGrid();
  }

  resizeGrid(): void {
    setTimeout(() => this.gridApi?.sizeColumnsToFit(), 100);
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.resizeGrid();
      },
      error: (err) => {
        console.error('Failed to load clients', err);
      },
    });
  }

  editClient(client: Client): void {
    this.selectedClient = client;
    this.showPopup = true;
  }

  closePopup(): void {
    this.selectedClient = null;
    this.showPopup = false;
  }

  onActiveToggleChange(params: any): void {
    const updatedClient = params.data as Client;
    // Save toggle status if needed
    params.api.refreshCells({ rowNodes: [params.node], force: true });
  }

  softDelete(client: Client): void {
    client.IsDeleted = true;
    this.clients = this.clients.filter((c) => c.ClientId !== client.ClientId);
    this.toasterService.show('Client removed successfully', 'success');
  }

  onExport(): void {
    this.gridApi.exportDataAsCsv({
      fileName: 'clients.csv',
    });
  }
}
