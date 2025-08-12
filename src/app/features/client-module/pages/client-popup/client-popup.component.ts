import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { Client } from '../../models/Client';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { TabStateService } from '../../services/tab-state-service/tab-state.service';
import { Tab } from '../../models/Tab.enum';
import { ClientService } from '../../services/client-services/client.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-client-popup',
  standalone: false,
  templateUrl: './client-popup.component.html',
  styleUrls: ['./client-popup.component.css'],
})
export class ClientPopupComponent implements OnInit {
  showConfirmModal = false;
  showSuccess = false;
  hasUnsavedChanges = false; // ← use this from child tabs when anything changes

  selectedTab: Tab = Tab.Details;
  loadedTabs: boolean[] = [true, false, false, false, false, false, false];
  Tab = Tab; // expose enum to template

  @Input() clientToEdit!: Client;
  @Input() isEditMode: boolean = false;
  @Output() close = new EventEmitter<void>();

  constructor(
    private clientService: ClientService,
    private tabState: TabStateService
  ) { }

  ngOnInit(): void {
    // Fresh state each time popup opens
    this.tabState.resetAll();

    if (this.isEditMode && this.clientToEdit) {
      // Pre-fill simple tabs
      this.tabState.updateCompanyInfo(this.clientToEdit);
      this.tabState.updateClaimInfo(this.clientToEdit);
      this.tabState.updateClientData(this.clientToEdit);
      this.tabState.updateCustomLabels(this.clientToEdit);

      // Behavioral tabs
      this.tabState.updateServices(this.clientToEdit.ClientService || []);
      this.tabState.updateRatingQuestions(this.clientToEdit.ClientRatingQuestion || []);
      this.tabState.updateDocuments(
        this.clientToEdit.clientDocument || this.clientToEdit.clientDocument || []
      );
      this.tabState.updateClaimCentre(this.clientToEdit.ClientClaimCentre || []);
      this.tabState.updateServiceProvider(this.clientToEdit.ClientServiceProvider || []);
      this.tabState.updateClaimController(this.clientToEdit.ClientClaimController || []);
    }
  }

  selectTab(tab: Tab): void {
    this.selectedTab = tab;
    this.loadedTabs[tab] = true;
  }

  /** Build API payload with safe defaults */
  private preparePayload(fullClient: Client): any {
    return {
      ClientId: fullClient.ClientId ?? 0,
      ClientGroupId: fullClient.ClientGroupId ?? 1,
      ClientName: fullClient.ClientName?.trim() || 'Unnamed Client',

      DoTextExport: !!fullClient.DoTextExport,
      IsActive: fullClient.IsActive ?? true,
      NearestClaimCentre: !!fullClient.NearestClaimCentre,
      PolicyLookup: !!fullClient.PolicyLookup,
      ProcessClaims: !!fullClient.ProcessClaims,
      UseMembershipNumber: !!fullClient.UseMembershipNumber,
      Validate: !!fullClient.Validate,
      ValidationExternalFile: !!fullClient.ValidationExternalFile,
      ValidationOther: !!fullClient.ValidationOther,
      ValidationWeb: !!fullClient.ValidationWeb,
      WebValidationAVS: !!fullClient.WebValidationAVS,
      WebValidationOTH: !!fullClient.WebValidationOTH,
      EnableVoucherExportOnDeathClaim: !!fullClient.EnableVoucherExportOnDeathClaim,

      ClaimsManager: fullClient.ClaimsManager || '',
      Address: fullClient.Address || '',
      ClaimFormDeclaration: fullClient.ClaimFormDeclaration || '',           // string, not null
      ClaimFormDeclarationPlain: fullClient.ClaimFormDeclarationPlain || '', // string, not null
      Code: fullClient.Code || '',
      CompanyLogo: fullClient.CompanyLogo || '',
      CompanyLogoData: fullClient.CompanyLogoData ?? null,
      Fax: fullClient.Fax || '',
      Mobile: fullClient.Mobile || '',
      OtherValidationNotes: fullClient.OtherValidationNotes || '',
      PolicyFile: fullClient.PolicyFile || '',
      PolicyLabel: fullClient.PolicyLabel || '',
      PolicyLookupFileData: fullClient.PolicyLookupFileData ?? null,
      PolicyLookupFileName: fullClient.PolicyLookupFileName || '',
      PolicyLookupPath: fullClient.PolicyLookupPath || '',
      PrintName: fullClient.PrintName || fullClient.ClientName || '',
      Tel: fullClient.Tel || '',

      ValidationLabel1: fullClient.ValidationLabel1 ?? null,
      ValidationLabel2: fullClient.ValidationLabel2 ?? null,
      ValidationLabel3: fullClient.ValidationLabel3 ?? null,
      ValidationLabel4: fullClient.ValidationLabel4 ?? null,
      ValidationLabel5: fullClient.ValidationLabel5 ?? null,
      ValidationLabel6: fullClient.ValidationLabel6 ?? null,

      WebURL: fullClient.WebURL || '',
      WebValidationURL: fullClient.WebValidationURL || '',

      // Make sure these names match your API model exactly
      ClientServiceProvider: fullClient.ClientServiceProvider || [],
      ClientService: fullClient.ClientService || [],
      ClientRatingQuestion: fullClient.ClientRatingQuestion || [],
      ClientDocument: fullClient.clientDocument ?? (fullClient as any).clientDocument ?? [],
      ClientClaimController: fullClient.ClientClaimController || [],
      ClientClaimCentre: (fullClient.ClientClaimCentre || []).map((c) => ({
        ClientClaimCentreId: c.ClientClaimCentreId ?? 0,
        ClientId: fullClient.ClientId ?? 0,
        ClaimCentreId: c.ClaimCentreId,
      })),
    };
  }

  save(): void {
    this.tabState
      .gatherFullClient()
      .pipe(take(1))
      .subscribe((fullClient: Client) => {
        // 🔎 see the claim slice right before we build payload
        console.log('[popup] claim snapshot:', this.tabState.claimInfoSnapshot);

        // ✅ failsafe: force claim fields from the live slice
        const snap = this.tabState.claimInfoSnapshot || {};
        fullClient.ClaimFormDeclaration =
          snap.ClaimFormDeclaration ?? fullClient.ClaimFormDeclaration ?? '';
        fullClient.ClaimFormDeclarationPlain =
          snap.ClaimFormDeclarationPlain ?? fullClient.ClaimFormDeclarationPlain ?? '';

        console.log('[popup] fullClient lenses:', {
          html: (fullClient.ClaimFormDeclaration || '').length,
          plain: (fullClient.ClaimFormDeclarationPlain || '').length,
        });

        const payload = this.preparePayload(this.sanitizeClient(fullClient));
        console.log('[popup] Final payload lenses:', {
          html: (payload.ClaimFormDeclaration || '').length,
          plain: (payload.ClaimFormDeclarationPlain || '').length,
        });

        const request$ = this.isEditMode
          ? this.clientService.updateClient(payload.ClientId, payload)
          : this.clientService.createClient(payload);

        request$.subscribe({
          next: () => {
            this.hasUnsavedChanges = false;
            this.showSuccess = true;
            setTimeout(() => { this.showSuccess = false; this.confirmClose(); }, 800);
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

  /** Remove UI-only DTOs before POST (keeps payload clean) */
  private sanitizeClient(c: Client): Client {
    // pull both casings, then write back as `ClientDocument`
    const docsIn = (c as any).ClientDocument ?? (c as any).clientDocument ?? [];
    const docs = (docsIn || []).map((d: any) => {
      const { DocumentDto, Document, FileData, ...rest } = d || {};
      return rest;
    });

    const svc = (c.ClientService || []).map((s: any) => {
      const { ServiceDto, ...rest } = s || {};
      return rest;
    });

    const prov = (c.ClientServiceProvider || []).map((sp: any) => {
      const { ProviderDto, ClientServiceProviderDto, ...rest } = sp || {};
      return rest;
    });

    // drop both casings and reassign the canonical key
    const { ClientDocument, clientDocument, ...rest } = c as any;

    return {
      ...rest,
      ClientService: svc,
      ClientDocument: docs,           // <- canonical
      ClientServiceProvider: prov,
    } as Client;
  }

  printPage(): void {
    throw new Error('Method not implemented.');
  }

  /** Manual close: show confirm (you can render different text if hasUnsavedChanges) */
  confirmClose(): void {
    this.showConfirmModal = true;
  }

  confirmYes(): void {
    this.showConfirmModal = false;
    this.close.emit();
  }
}
