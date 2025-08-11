import { Component } from '@angular/core';
import { ClaimCentre } from '../../../claim-centre/models/ClaimCentre';
import {
  CellClickedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';

import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UnlinkCellRendererComponent } from '../../../../shared/component/unlink-cell-renderer/unlink-cell-renderer.component';
import { ClaimCentreService } from '../../../claim-centre/services/claim-centre-services/claim-centre.service';
import { ClaimCentreStateService } from '../../../claim-centre/services/claim-centre-state/claim-centre-state.service';
import { TabStateService } from '../../services/tab-state-service/tab-state.service';
import { ClientClaimCentre } from '../../models/Client';

@Component({
  selector: 'app-claim-centre',
  standalone: false,
  templateUrl: './claim-centre.component.html',
  styleUrl: './claim-centre.component.css',
})
export class ClaimCentreComponent {
  /** Data stored in TabStateService */
  rowData: ClientClaimCentre[] = [];

  gridApi!: GridApi;
  claimCentreList: { id: number; name: string }[] = [];
  form: FormGroup;

  columnDefs: ColDef[] = [
    {
      field: 'ClaimCentre.Name',
      headerName: 'Claim Centre',
      flex: 1,
      minWidth: 160,
      valueGetter: (params) => params.data?.ClaimCentre?.Name || '',
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      headerName: 'Delete',
      cellRenderer: 'unlinkCellRenderer',
      maxWidth: 100,
      filter: false,
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
    unlinkCellRenderer: UnlinkCellRendererComponent,
  };

  constructor(
    private claimCentreService: ClaimCentreService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private tabState: TabStateService
  ) {
    this.form = this.fb.group({
      selectedClaimCentre: [null],
    });
  }

  ngOnInit(): void {
    this.loadClaimCentreList();

    // Load existing Claim Centres from TabStateService
    this.tabState.getClaimCentre().subscribe((data) => {
      this.rowData = [...data];
    });
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  /** Fetch list of original claim centres */
  loadClaimCentreList(): void {
    this.claimCentreService.getClaimCentres().subscribe((data) => {
      const activeClaimCentres = data.filter((c) => c.IsActive && !c.IsDeleted);
      this.claimCentreList = activeClaimCentres.map((item) => ({
        id: item.ClaimCentreId!,
        name: item.Branch || item.Name || '',
      }));
    });
  }

  /** Add a claim centre to TabState */
  onAddClaimCentre(): void {
    const selectedId = this.form.value.selectedClaimCentre;

    if (!selectedId) {
      this.toastrService.show('Please select a Claim Centre', 'error');
      return;
    }

    const alreadyExists = this.rowData.some(
      (c) => c.ClaimCentreId === selectedId
    );
    if (alreadyExists) {
      this.toastrService.show('Claim Centre already added', 'info');
      return;
    }

    // Create a new mapping record for ClientClaimCentre
    const selectedCentre = this.claimCentreList.find(
      (c) => c.id === selectedId
    );
    if (selectedCentre) {
      const newItem: ClientClaimCentre = {
        ClientClaimCentreId: 0, // New record
        ClientId: 0, // Will be set when saving the client
        ClaimCentreId: selectedCentre.id,
        ClaimCentre: {
          ClaimCentreId: selectedCentre.id,
          Name: selectedCentre.name,
        },
      };

      const updatedList = [...this.rowData, newItem];
      this.rowData = updatedList; // Update grid
      this.tabState.updateClaimCentre(updatedList);

      this.toastrService.show('Claim Centre added', 'success');
      this.form.get('selectedClaimCentre')?.reset();
    }
  }

  /** Soft delete claim centre from TabState */
  softDelete(row: ClientClaimCentre): void {
    if (!row?.ClaimCentreId) {
      this.toastrService.show('Invalid record', 'error');
      return;
    }

    const updatedList = this.rowData.filter(
      (c) => c.ClaimCentreId !== row.ClaimCentreId
    );
    this.rowData = updatedList;
    this.tabState.updateClaimCentre(updatedList);

    this.toastrService.show('Item removed', 'success');
  }
}
