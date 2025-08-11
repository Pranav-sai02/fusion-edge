import { Component, Input } from '@angular/core';
import { ClaimCentre } from '../../models/ClaimCentre';
import {
  GridApi,
  ColDef,
  GridReadyEvent,
  CellClickedEvent,
  ICellRendererParams,
} from 'ag-grid-community';

import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';

import { ViewButtonRendererComponent } from '../../../../shared/component/view-button-renderer/view-button-renderer.component';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';
import { ClaimCentreService } from '../../services/claim-centre-services/claim-centre.service';
import { ClientGroupService } from '../../../client-module/services/client-group-services/client-group.service';

@Component({
  selector: 'app-claim-centre',
  standalone: false,
  templateUrl: './claim-centre.component.html',
  styleUrl: './claim-centre.component.css',
})
export class ClaimCentreComponent {
  showClaimCentrePopup: boolean = false;
  editedClaimCentre: any = null;
  rowData: ClaimCentre[] = [];
  gridApi!: GridApi;
  selectedClaim: ClaimCentre | null = null;
  showPopup = false;
  isEditMode = false;
  @Input() initialData: ClaimCentre | null = null;

  clientGroupMap: { [key: number]: string } = {};

  columnDefs: ColDef[] = [
    {
      field: 'ClientGroupId',
      headerName: 'Client Group',
      valueGetter: (params) =>
        this.clientGroupMap[params.data.ClientGroupId] || '',

      flex: 1,
      minWidth: 200,
      cellStyle: {
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'Name',
      headerName: 'Name',
      flex: 2,
      minWidth: 150,
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
      field: 'Address',
      headerName: 'Address',
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
      field: 'IsActive',
      headerName: 'Active',
      minWidth: 150,
      cellRenderer: 'activeToggleRenderer',
      cellRendererParams: (params: ICellRendererParams<ClaimCentre>) => {
        return {
          isDisabled: true,
        };
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
      suppressHeaderMenuButton: true,
      pinned: 'right',
      sortable: false,
      filter: false,
      flex: 1,
      maxWidth: 90,
      cellRenderer: 'viewButtonRenderer',
      onCellClicked: (params: CellClickedEvent) => this.openPopup(params.data),
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '17px',
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
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
  };

  components = {
    activeToggleRenderer: ActiveToggleRendererComponent,
    softDeleteRenderer: SoftDeleteButtonRendererComponent,
    viewButtonRenderer: ViewButtonRendererComponent,
  };

  constructor(
    private claimCentreService: ClaimCentreService,
    private toastrService: ToastrService,
    private clientGroupService: ClientGroupService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadClientGroups();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  loadData(): void {
    this.claimCentreService.getClaimCentres().subscribe({
      next: (data) => {
        this.rowData = data
          .filter((item) => !item.IsDeleted)
          .sort((a, b) => b.ClaimCentreId - a.ClaimCentreId); // newest on top
        setTimeout(() => this.gridApi?.refreshCells(), 0);
      },
      error: () => {
        this.toastrService.show('Failed to load claim centres.', 'error');
      },
    });
  }

  loadClientGroups(): void {
    this.clientGroupService.getClientGroups().subscribe((groups) => {
      // Create a map { ClientGroupId: Name }
      this.clientGroupMap = groups.reduce((map, group) => {
        map[group.ClientGroupId!] = group.Name;
        return map;
      }, {} as { [key: number]: string });
    });
  }

  onAddClaimCentre() {
    this.editedClaimCentre = null; // new add
    this.showClaimCentrePopup = true;
  }

  onEditClaimCentre(selected: ClaimCentre) {
    this.editedClaimCentre = { ...selected }; // clone the selected object
    this.showClaimCentrePopup = true;
  }
  openPopup(row: ClaimCentre): void {
    this.editedClaimCentre = { ...row }; // use editedClaimCentre
    this.showClaimCentrePopup = true;
  }
  closePopup() {
    this.showClaimCentrePopup = false;
    this.editedClaimCentre = null;
    // optionally reload the table data
  }

  handleFormSubmit(data: ClaimCentre): void {
    this.showClaimCentrePopup = false;

    this.claimCentreService.getClaimCentres().subscribe({
      next: (data) => {
        this.rowData = data
          .filter((c) => !c.IsDeleted)
          .sort((a, b) => b.ClaimCentreId - a.ClaimCentreId); // newest on top

        setTimeout(() => {
          // Optionally reset sort
          // (this.gridApi as any).setSortModel([]);
          this.gridApi.paginationGoToFirstPage?.();
          this.gridApi.ensureIndexVisible(0, 'top');
          this.gridApi.refreshCells();
        }, 0);

        this.toastrService.show('Claim updated successfully', 'success');
      },
      error: () => {
        this.toastrService.show('Failed to reload claim centres.', 'error');
      },
    });
  }

  softDelete(row: ClaimCentre): void {
    if (!row?.ClaimCentreId) {
      this.toastrService.show('Invalid claim record (missing ID).', 'error');
      return;
    }

    const updatedRow: ClaimCentre = {
      ...row,
      IsDeleted: true,
    };

    this.claimCentreService
      .updateClaimCentre(updatedRow.ClaimCentreId, updatedRow)
      .subscribe({
        next: () => {
          this.rowData = this.rowData.filter(
            (r) => r.ClaimCentreId !== updatedRow.ClaimCentreId
          );
          this.toastrService.show('Claim deleted successfully', 'success');
        },
        error: () => {
          this.toastrService.show('Delete failed. Try again.', 'error');
        },
      });
  }
}
