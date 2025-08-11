import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ServiceProvidersService } from '../../../service-provider/service-providers/services/service-providers/service-providers.service';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UnlinkCellRendererComponent } from '../../../../shared/component/unlink-cell-renderer/unlink-cell-renderer.component';

import { ClientServiceProvider } from '../../models/Client';
import { ServiceProvider } from '../../../service-provider/service-providers/models/ServiceProvider';
import { TabStateService } from '../../services/tab-state-service/tab-state.service';
@Component({
  selector: 'app-service-provider',
  standalone: false,
  templateUrl: './service-provider.component.html',
  styleUrl: './service-provider.component.css',
})
export class ServiceProviderComponent implements OnInit, OnDestroy {
  serviceProviders: ServiceProvider[] = [];
  linkedProviders: (ClientServiceProvider & { ServiceProviderName?: string })[] = [];
  gridApi!: GridApi;
  form: FormGroup;

  serviceProviderList: { id: string; name: string }[] = [];
  UnlinkCellRendererComponent = UnlinkCellRendererComponent;

  columnDefs: ColDef<ClientServiceProvider & { ServiceProviderName?: string }>[] = [
    {
      field: 'ServiceProviderName',
      headerName: 'Service Provider',
      flex: 1,
      minWidth: 200,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      suppressHeaderMenuButton: true,
      pinned: 'right',
      flex: 1,
      maxWidth: 100,
      cellRenderer: 'unlinkCellRenderer',
      cellRendererParams: {
        onUnlink: (data: ClientServiceProvider) => this.softDelete(data),
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
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
  };

  constructor(
    private providerService: ServiceProvidersService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private tabState: TabStateService
  ) {
    this.form = this.fb.group({
      selectedServiceProvider: [null],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadProviders(); // ensure provider data is loaded first

    this.tabState.getServiceProvider().subscribe((providers) => {
      this.linkedProviders = providers.map((p) => {
        const matchingProvider = this.serviceProviders.find(
          (sp) => sp.ServiceProviderId === p.ServiceProviderId
        );
        return {
          ...p,
          ServiceProviderName: matchingProvider?.Name || '',
        };
      });

      if (this.gridApi) {
        this.gridApi.setGridOption('rowData', this.linkedProviders);
      }
    });
  }


  private loadProviders(): Promise<void> {
    return new Promise((resolve) => {
      this.providerService.getServiceProviders().subscribe({
        next: (data) => {
          this.serviceProviders = data;
          this.serviceProviderList = data
            .filter((sp) => sp.IsActive)
            .map((sp) => ({
              id: sp.ServiceProviderId?.toString() || '',
              name: sp.Name,
            }));
          resolve();
        },
        error: (err) => {
          console.error('Failed to load service providers:', err);
          this.toastrService.show('Failed to load service providers.', 'error');
          resolve(); // still resolve to avoid blocking
        },
      });
    });
  }

  onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    this.gridApi.setGridOption('rowData', this.linkedProviders);
  }

  softDelete(provider: ClientServiceProvider): void {
    const id = provider.ServiceProviderId;
    if (!id) return;

    const updatedList = this.linkedProviders.filter(
      (p) => p.ServiceProviderId !== id
    );
    this.tabState.updateServiceProvider(updatedList);

    this.gridApi.applyTransaction({ remove: [provider] });
    this.toastrService.show('Item unlinked successfully', 'success');
  }

  addServiceProviderToGrid(): void {
    const selectedId = this.form.get('selectedServiceProvider')?.value;

    if (!selectedId) {
      this.toastrService.show('Please select a service provider.', 'error');
      return;
    }

    const alreadyAdded = this.linkedProviders.some(
      (sp) => sp.ServiceProviderId?.toString() === selectedId
    );

    if (alreadyAdded) {
      this.toastrService.show('Service provider already added.', 'info');
      return;
    }

    const providerToAdd = this.serviceProviders.find(
      (sp) => sp.ServiceProviderId?.toString() === selectedId
    );

    if (!providerToAdd) {
      this.toastrService.show('Service provider not found.', 'error');
      return;
    }

    // Minimal payload (no ClientServiceProviderDto)
    const newProvider: ClientServiceProvider & { ServiceProviderName?: string } = {
      ClientServiceProviderId: 0,
      ClientId: 0,
      ServiceProviderId: providerToAdd.ServiceProviderId!,
      //ServiceProviderName: providerToAdd.Name, // for UI only
    };

    const updatedList = [...this.linkedProviders, newProvider];
    this.tabState.updateServiceProvider(updatedList);

    this.form.get('selectedServiceProvider')?.reset();
    this.toastrService.show(`${providerToAdd.Name} added to grid`, 'success');
  }

  ngOnDestroy(): void {
    // Optional cleanup logic
  }
}
