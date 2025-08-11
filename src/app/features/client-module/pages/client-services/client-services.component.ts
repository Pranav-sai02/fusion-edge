import { Component, OnInit } from '@angular/core';
import { ServicesPage } from '../../../service-provider/services-page/models/Services-page';
import {
  CellClickedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { ServicesPageService } from '../../../service-provider/services-page/services/service-page/services-page.service';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';
import { UnlinkCellRendererComponent } from '../../../../shared/component/unlink-cell-renderer/unlink-cell-renderer.component';
import { LinkedServicesService } from '../../services/linkservice/linked-services.service';
import { ClientService } from '../../models/Client';
import { TabStateService } from '../../services/tab-state-service/tab-state.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-client-services',
  standalone: false,
  templateUrl: './client-services.component.html',
  styleUrl: './client-services.component.css',
})
export class ClientServicesComponent implements OnInit {
   UnlinkCellRendererComponent = UnlinkCellRendererComponent;

  rows: ClientService[] = [];
  showPopup = false;
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    {
      headerName: 'Service',
      valueGetter: (params) => params.data?.ServiceDto?.Description || '',
      flex: 1,
      minWidth: 200,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      headerName: 'Delete',
      pinned: 'right',
      maxWidth: 100,
      sortable: false,
      filter: false,
      cellRenderer: 'unlinkCellRenderer',
      onCellClicked: ({ data }: CellClickedEvent<ClientService>) => {
        if (data) this.softDelete(data);
      },
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
    resizable: true,
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
  };

  constructor(
    private toastr: ToastrService,
    private tabState: TabStateService,
    private servicesPageService: ServicesPageService
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.servicesPageService.getAllServices(), // Observable<ServicesPage[]>
      this.tabState.getServices() // Observable<ClientService[]>
    ]).subscribe({
      next: ([serviceMasterList, services]) => {
        const patched = services.map((s) => {
          // Always attach ServiceDto from master list if missing
          const dto = s.ServiceDto ?? serviceMasterList.find(m => m.ServiceId === s.ServiceId);
          return { ...s, ServiceDto: dto };
        });

        this.rows = patched;
      },
      error: (err) => {
        console.error('Error loading service data:', err);
        this.toastr.show('Failed to load services', 'error');
      }
    });
  }

  onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
  }

  onServiceLinked(service: {
    ServiceId: number;
    Description: string;
    Note: string;
    TransferNumber: string;
  }): void {
    const exists = this.rows.some(s => s.ServiceId === service.ServiceId);
    if (exists) {
      this.toastr.show('Service already linked', 'info');
      return;
    }

    const newEntry: ClientService = {
      ClientServiceId: 0,
      ClientId: 0, // set later if needed
      ServiceId: service.ServiceId,
      Note: service.Note,
      TransferNumber: service.TransferNumber,
      ServiceDto: {
        ServiceId: service.ServiceId,
        Description: service.Description
      }
    };

    const updated = [...this.rows, newEntry];
    this.tabState.updateServices(updated);
    this.rows = updated;
    this.toastr.show('Service linked successfully', 'success');
    this.showPopup = false;
  }

  softDelete(service: ClientService): void {
    const updated = this.rows.filter(s => s.ServiceId !== service.ServiceId);
    this.tabState.updateServices(updated);
    this.rows = updated;
    this.toastr.show('Service removed', 'success');
  }
}
