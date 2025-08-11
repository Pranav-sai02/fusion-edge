import { Component } from '@angular/core';
import { ServiceProvider } from '../../models/ServiceProvider';
import { ServiceProvidersService } from '../../services/service-providers/service-providers.service';
import {
  CellClickedEvent,
  ColDef,
  GridApi,
  ICellRendererParams,
} from 'ag-grid-community';
import { SoftDeleteButtonRendererComponent } from '../../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { ActiveToggleRendererComponent } from '../../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';

import { ViewButtonRendererComponent } from '../../../../../shared/component/view-button-renderer/view-button-renderer.component';
import { ToastrService } from '../../../../../shared/component/toastr/services/toastr.service';
import { User } from '../../../../users/models/User';
import { UserService } from '../../../../users/services/user.service';
import { ServiceProviderTypes } from '../../../service-provider-types/models/ServiceProviderTypes';
import { ServiceProviderTypesService } from '../../../service-provider-types/services/serviceProvider-types/service-provider-types.service';

@Component({
  selector: 'app-service-providers',
  standalone: false,
  templateUrl: './service-providers.component.html',
  styleUrl: './service-providers.component.css',
})
export class ServiceProvidersComponent {
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;
  ViewButtonRendererComponent = ViewButtonRendererComponent;

  users: User[] = [];
  userMap: { [id: number]: string } = {};

  serviceProviderTypes: ServiceProviderTypes[] = [];
  serviceProviderTypeMap: { [id: number]: string } = {};

  selectedProvider: ServiceProvider | null = null;
  isEditMode = false;
  showPopup = false;

  serviceProviders: ServiceProvider[] = [];
  gridApi!: GridApi;

  columnDefs: ColDef[] = [
    {
      field: 'Name',
      headerName: 'Name',
      flex: 2,
      minWidth: 200,
      cellStyle: {
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'VATNumber',
      headerName: 'VAT Number',
      flex: 1,
      minWidth: 200,
      cellStyle: {
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'CompanyRegNo',
      headerName: 'Company Reg. No',
      flex: 1,
      minWidth: 200,
      cellStyle: {
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'Branch',
      headerName: 'Branch',
      flex: 1,
      minWidth: 160,
      cellStyle: {
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'OfficeAddress',
      headerName: 'Office Address',
      flex: 1,
      minWidth: 200,
      // wrapText: true,
      // autoHeight: true,
      // cellStyle: {
      //   textAlign: 'left',
      //   whiteSpace: 'nowrap',
      //   overflow: 'hidden',
      //   textOverflow: 'ellipsis',
      // },
      cellStyle: {
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'StorageAddress',
      headerName: 'Storage Address',
      flex: 1,
      minWidth: 200,
      // wrapText: true,
      // autoHeight: true,
      // cellStyle: {
      //   textAlign: 'left',
      //   whiteSpace: 'nowrap',
      //   overflow: 'hidden',
      //   textOverflow: 'ellipsis',
      // },
      cellStyle: {
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'TownCity',
      headerName: 'Town / City',
      flex: 1,
      minWidth: 200,
      cellStyle: {
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'Province',
      headerName: 'Province',
      minWidth: 200,
      cellStyle: {
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'ServiceProviderTypeId',
      headerName: 'Service Type',
      valueGetter: (params) =>
        this.serviceProviderTypeMap[params.data?.ServiceProviderTypeId] ||
        'N/A',
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
      field: 'DesignationNumber',
      headerName: 'Designation No',
      flex: 1,
      minWidth: 140,
      cellStyle: {
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'RatePerKm',
      headerName: 'Rate per Km',
      flex: 1,
      minWidth: 120,
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'RateAuthorisedOn',
      headerName: 'Rate Authorised On',
      valueFormatter: this.dateFormatter,
      flex: 1,
      minWidth: 160,
      cellStyle: {
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'AuthorisedBy',
      headerName: 'Rate Authorised By',
      valueGetter: (params) => this.userMap[params.data?.AuthorisedBy] || 'N/A',
      flex: 1,
      minWidth: 150,
      cellStyle: {
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      minWidth: 150,
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
      field: 'ActiveOn',
      headerName: 'Active On',
      valueFormatter: this.dateFormatter,
      minWidth: 150,
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'ActiveBy',
      headerName: 'Active By',
      valueGetter: (params) => this.userMap[params.data?.ActiveBy] || 'N/A',
      minWidth: 150,
      cellStyle: {
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'IsVerified',
      headerName: 'Verified',
      minWidth: 100,
      cellRenderer: (params: any) => {
        const icon = params.value ? 'tick' : 'cross';
        return `<img src="assets/icons/${icon}.png" alt="${
          params.value ? 'Yes' : 'No'
        }" style="width: 20px; height: 20px;" />`;
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
      field: 'VerifiedOn',
      headerName: 'Verified On',
      valueFormatter: this.dateFormatter,
      minWidth: 150,
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'VerifiedBy',
      headerName: 'Verified By',
      valueGetter: (params) => this.userMap[params.data?.VerifiedBy] || 'N/A',
      minWidth: 150,
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'IsAccredited',
      headerName: 'Accredited',
      minWidth: 120,
      cellRenderer: (params: any) => {
        const icon = params.value ? 'tick' : 'cross';
        return `<img src="assets/icons/${icon}.png" alt="${
          params.value ? 'Yes' : 'No'
        }" style="width: 20px; height: 20px;" />`;
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
      field: 'AccreditedOn',
      headerName: 'Accredited On',
      valueFormatter: this.dateFormatter,
      minWidth: 150,
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'AccreditedBy',
      headerName: 'Accredited By',
      valueGetter: (params) => this.userMap[params.data?.AccreditedBy] || 'N/A',
      minWidth: 150,
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    // {
    //   field: 'ContactDetails',
    //   headerName: 'Contact Details',
    //   valueGetter: (params) =>
    //     params.data?.ContactDetails?.map(
    //       (c: any) => `${c.Type}: ${c.Value}`
    //     ).join(', '),
    //   minWidth: 250,
    //   maxWidth: 500,
    //   tooltipField: 'ContactDetails',
    //   cellStyle: {
    //     whiteSpace: 'nowrap',
    //     overflow: 'hidden',
    //     textOverflow: 'ellipsis',
    //     textAlign: 'left',
    //   },
    // },

    {
      suppressHeaderMenuButton: true,
      pinned: 'right',
      sortable: false,
      filter: false,
      maxWidth: 90,
      flex: 1,
      cellRenderer: 'viewButtonRenderer',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '17px',
      },
      onCellClicked: (params: CellClickedEvent) => this.openPopup(params.data),
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
    headerClass: 'bold-header',
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
    cellStyle: {
      borderRight: '1px solid #ccc',
    },
  };

  constructor(
    private providerService: ServiceProvidersService,
    private toastrService: ToastrService,
    private userService: UserService,
    private serviceProviderTypesService: ServiceProviderTypesService
  ) {}

  ngOnInit(): void {
    this.loadProviders();
    this.loadServiceProviderTypes();
    this.loadUsers();
  }

  loadProviders(): void {
    this.providerService.getServiceProviders().subscribe({
      next: (data) => {
        this.serviceProviders = data;

        // ✅ Sort so newest records appear on top
        this.serviceProviders.sort(
          (a, b) => b.ServiceProviderId! - a.ServiceProviderId!
        );
      },
      error: (err) => {
        console.error('Failed to load service providers', err);
        this.toastrService.show('Failed to load data', 'error');
      },
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.userMap = users.reduce((map, user) => {
          map[user.AspNetUserId!] = `${user.Firstname || ''} ${
            user.Lastname || ''
          }`.trim();

          return map;
        }, {} as { [id: number]: string });

        // Refresh grid to reflect new userMap
        this.gridApi?.refreshCells({ force: true });
      },
      error: (err) => {
        console.error('Failed to load users', err);
      },
    });
  }

  loadServiceProviderTypes(): void {
    this.serviceProviderTypesService.getAll().subscribe({
      next: (types) => {
        this.serviceProviderTypes = types;
        this.serviceProviderTypeMap = types.reduce((map, type) => {
          map[type.ServiceProviderTypeId!] = type.Description;
          return map;
        }, {} as { [id: number]: string });

        // Refresh grid to reflect new mapping
        this.gridApi?.refreshCells({ force: true });
      },
      error: (err) => {
        console.error('Failed to load service provider types', err);
        this.toastrService.show(
          'Failed to load service provider types',
          'error'
        );
      },
    });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;

    // Optional: Only auto-size some columns (e.g., short ones)
    const autoSizeThese = [
      'Name',
      'VATNumber',
      'Branch',
      'Manager',
      'Province',
    ];
    setTimeout(() => {
      const colIds =
        this.gridApi
          .getColumnDefs()
          ?.map((col: any) => col.field)
          .filter((id: string) => autoSizeThese.includes(id)) || [];
      this.gridApi.autoSizeColumns(colIds);
    }, 100);
  }

  resetColumns(): void {
    this.gridApi.setGridOption('columnDefs', this.columnDefs);
  }

  openPopup(rowData: ServiceProvider) {
    this.selectedProvider = rowData;
    this.isEditMode = true;
    this.showPopup = true;
  }

  handleFormSubmit(data: ServiceProvider) {
    this.providerService.addServiceProvider(data).subscribe({
      next: (newProvider) => {
        console.log('New provider added:', newProvider);

        if (newProvider && newProvider.ServiceProviderId) {
          this.serviceProviders = [newProvider, ...this.serviceProviders];

          this.toastrService.show(
            'Service provider added successfully',
            'success'
          );
        } else {
          this.toastrService.show('Invalid response from server', 'error');
        }

        this.showPopup = false;
      },
      error: (err) => {
        console.error('Add failed:', err);
        this.toastrService.show('Failed to add service provider', 'error');
      },
    });
  }

  softDelete(row: ServiceProvider): void {
    // Set IsDeleted true locally
    row.IsDeleted = true;

    this.providerService.softDeleteServiceProvider(row).subscribe({
      next: () => {
        // Remove from UI
        this.serviceProviders = this.serviceProviders.filter(
          (r) => r.ServiceProviderId !== row.ServiceProviderId
        );
        this.toastrService.show('Removed successfully', 'success');
      },
      error: (err) => {
        console.error('Soft delete failed:', err);
        this.toastrService.show('Failed to delete', 'error');
        row.IsDeleted = false; // Optional rollback
      },
    });
  }

  dateFormatter(params: any): string {
    if (!params.value) return '';
    const date = new Date(params.value);
    return date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
  }

  newServiceProvider(): void {
    if (this.users.length === 0) {
      this.loadUsers(); // make sure it’s loaded
    }

    this.selectedProvider = null;
    this.isEditMode = false;
    this.showPopup = true;
  }
}
