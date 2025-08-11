import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { Client } from '../../models/Client';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ClientService } from '../../services/client-services/client.service';
import { TabStateService } from '../../services/tab-state-service/tab-state.service';
import { Tab } from '../../models/Tab.enum';

@Component({
  selector: 'app-client-popup',
  standalone: false,
  templateUrl: './client-popup.component.html',
  styleUrls: ['./client-popup.component.css'],
})
export class ClientPopupComponent implements OnInit {
  // public selectedTab: number = 0;
  showConfirmModal = false;
  showSuccess = false;
  selectedTab: Tab = Tab.Details;
  loadedTabs: boolean[] = [true, false, false, false, false, false, false];
  Tab = Tab; // Expose the enum to the template

  // tabs = [
  //   { label: 'Details', type: 'details' },
  //   { label: 'Services', type: 'services' },
  //   { label: 'Rating-Questions', type: 'rating-questions' },
  //   { label: 'Documents', type: 'documents' },
  //   { label: 'Claim-Centre', type: 'claim-centre' },
  //   { label: 'Service-Provider', type: 'service-provider' },
  //   { label: 'Claim-Controller', type: 'claim-controller' },
  // ];

  @Input() clientToEdit!: Client;
  @Input() isEditMode: boolean = false;
  @Output() close = new EventEmitter<void>();

  constructor(
    private clientService: ClientService,
    private tabState: TabStateService
  ) {}

  // ngOnInit(): void {
  //   if (this.isEditMode && this.clientToEdit) {
  //     // Pre-fill all accordions with existing data
  //     this.tabState.updateCompanyInfo(this.clientToEdit);
  //     this.tabState.updateClaimInfo(this.clientToEdit);
  //     this.tabState.updateClientData(this.clientToEdit);
  //     this.tabState.updateCustomLabels(this.clientToEdit);

  //   }
  // }

  ngOnInit(): void {
    this.tabState.resetAll(); // ⬅️ Add this to clear out old client data

    if (this.isEditMode && this.clientToEdit) {
      // Pre-fill all accordions with existing data
      this.tabState.updateCompanyInfo(this.clientToEdit);
      this.tabState.updateClaimInfo(this.clientToEdit);
      this.tabState.updateClientData(this.clientToEdit);
      this.tabState.updateCustomLabels(this.clientToEdit);

      // Behavioral Tabs (🔥 THIS IS WHAT YOU MISSED)
      this.tabState.updateServices(this.clientToEdit.ClientService || []);
      this.tabState.updateRatingQuestions(
        this.clientToEdit.ClientRatingQuestion || []
      );
      this.tabState.updateDocuments(this.clientToEdit.clientDocument || []);
      this.tabState.updateClaimCentre(
        this.clientToEdit.ClientClaimCentre || []
      );
      this.tabState.updateServiceProvider(
        this.clientToEdit.ClientServiceProvider || []
      );
      this.tabState.updateClaimController(
        this.clientToEdit.ClientClaimController || []
      );
    }
  }

  // selectTab(index: number): void {
  //   this.selectedTab = index;
  // }

  selectTab(tab: Tab): void {
    this.selectedTab = tab;
    this.loadedTabs[tab] = true;
  }

  /** Prepare payload with safe defaults */
  private preparePayload(fullClient: Client): any {
    return {
      ClientId: fullClient.ClientId || 0,
      ClientGroupId: fullClient.ClientGroupId || 1,
      ClientName: fullClient.ClientName?.trim() || 'Unnamed Client',
      DoTextExport: fullClient.DoTextExport ?? false,
      IsActive: fullClient.IsActive ?? true,
      NearestClaimCentre: fullClient.NearestClaimCentre ?? false,
      PolicyLookup: fullClient.PolicyLookup ?? false,
      ProcessClaims: fullClient.ProcessClaims ?? false,
      UseMembershipNumber: fullClient.UseMembershipNumber ?? false,
      Validate: fullClient.Validate ?? false,
      ValidationExternalFile: fullClient.ValidationExternalFile ?? false,
      ValidationOther: fullClient.ValidationOther ?? false,
      ValidationWeb: fullClient.ValidationWeb ?? false,
      WebValidationAVS: fullClient.WebValidationAVS ?? false,
      WebValidationOTH: fullClient.WebValidationOTH ?? false,
      EnableVoucherExportOnDeathClaim:
        fullClient.EnableVoucherExportOnDeathClaim ?? false,

      ClaimsManager: fullClient.ClaimsManager || '',
      Address: fullClient.Address || '',
      ClaimFormDeclaration: fullClient.ClaimFormDeclaration || null,
      ClaimFormDeclarationPlain: fullClient.ClaimFormDeclarationPlain || null,
      Code: fullClient.Code || '',
      CompanyLogo: fullClient.CompanyLogo || '',
      CompanyLogoData: fullClient.CompanyLogoData || null,
      Fax: fullClient.Fax || '',
      Mobile: fullClient.Mobile || '',
      OtherValidationNotes: fullClient.OtherValidationNotes || '',
      PolicyFile: fullClient.PolicyFile || '',
      PolicyLabel: fullClient.PolicyLabel || '',
      PolicyLookupFileData: fullClient.PolicyLookupFileData || null,
      PolicyLookupFileName: fullClient.PolicyLookupFileName || '',
      PolicyLookupPath: fullClient.PolicyLookupPath || '',
      PrintName: fullClient.PrintName || fullClient.ClientName || '',
      Tel: fullClient.Tel || '',

      ValidationLabel1: fullClient.ValidationLabel1 || null,
      ValidationLabel2: fullClient.ValidationLabel2 || null,
      ValidationLabel3: fullClient.ValidationLabel3 || null,
      ValidationLabel4: fullClient.ValidationLabel4 || null,
      ValidationLabel5: fullClient.ValidationLabel5 || null,
      ValidationLabel6: fullClient.ValidationLabel6 || null,

      WebURL: fullClient.WebURL || '',
      WebValidationURL: fullClient.WebValidationURL || '',

      ClientServiceProvider: fullClient.ClientServiceProvider || [],
      ClientService: fullClient.ClientService || [],
      ClientRatingQuestion: fullClient.ClientRatingQuestion || [],
      clientDocument: fullClient.clientDocument || [],
      ClientClaimController: fullClient.ClientClaimController || [],
      ClientClaimCentre: (fullClient.ClientClaimCentre || []).map((c) => ({
        ClientClaimCentreId: c.ClientClaimCentreId || 0,
        ClientId: fullClient.ClientId || 0,
        ClaimCentreId: c.ClaimCentreId,
      })),
    };
  }

  save(): void {
    this.tabState.gatherFullClient().subscribe((fullClient: Client) => {
      console.log('Merged client data to save:', fullClient);

      const payload = this.preparePayload(fullClient);
      console.log('Final payload:', payload);

      const request$ = this.isEditMode
        ? this.clientService.updateClient(payload.ClientId, payload)
        : this.clientService.createClient(payload);

      request$.subscribe({
        next: () => {
          this.showSuccess = true;
          setTimeout(() => {
            this.showSuccess = false;
            this.confirmClose();
          }, 2000);
        },
        error: (err) => {
          console.error('Failed to save client:', err);
          if (err?.error?.errors) {
            const messages = Object.values(err.error.errors).flat().join('\n');
            alert(`Validation failed:\n${messages}`);
          } else {
            alert('Failed to save client.');
          }
        },
      });
    });
  }

  printPage() {
    throw new Error('Method not implemented.');
  }

  confirmClose() {
    this.showConfirmModal = true;
  }
  confirmYes() {
    this.showConfirmModal = false;
    this.close.emit();
  }
}
