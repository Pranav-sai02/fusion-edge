import { Component } from '@angular/core';
import { TabStateService } from '../../../services/tab-state-service/tab-state.service';

@Component({
  selector: 'app-client-data',
  standalone: false,
  templateUrl: './client-data.component.html',
  styleUrl: './client-data.component.css',
})
export class ClientDataComponent {
  // Checkbox states
  useMembershipNumber = false;
  usePolicyLookup = false;
  useExternalFile = false;
  useWebValidation = false;
  useWebValidationAVS = false;
  useOtherValidation = false;
  useTextExport = false;
  useWebValidationOTH = false;

  // Other fields
  selectedValue: number | null = null;
  policyLookupPath = '';
  validationUrl = '';
  notes = '';

  policyFiles = [
    { label: 'File A', value: 1 },
    { label: 'File B', value: 2 },
    { label: 'File C', value: 3 },
  ];

  constructor(private tabState: TabStateService) {}

  ngOnInit(): void {
    // Restore previous state from TabStateService
    this.tabState.getClientData().subscribe((data) => {
      if (data) {
        this.useMembershipNumber = data.UseMembershipNumber ?? false;
        this.usePolicyLookup = data.PolicyLookup ?? false;
        this.useExternalFile = data.ValidationExternalFile ?? false;
        this.useWebValidation = data.ValidationWeb ?? false;
        this.useWebValidationAVS = data.WebValidationAVS ?? false;
        this.useOtherValidation = data.ValidationOther ?? false;
        this.useTextExport = data.DoTextExport ?? false;
        this.useWebValidationOTH = data.WebValidationOTH ?? false;
        this.policyLookupPath = data.PolicyLookupPath ?? '';
        this.validationUrl = data.WebValidationURL ?? '';
        this.notes = data.OtherValidationNotes ?? '';

        // Match selected policy file by label
        if (data.PolicyFile) {
          const found = this.policyFiles.find(
            (p) => p.label === data.PolicyFile
          );
          this.selectedValue = found ? found.value : null;
        }
      }
    });
  }

  /**
   * Syncs all current values with TabStateService
   */
  updateClientDataState(): void {
    const selectedFileLabel = this.selectedValue
      ? this.policyFiles.find((p) => p.value === this.selectedValue)?.label
      : '';

    this.tabState.updateClientData({
      UseMembershipNumber: this.useMembershipNumber,
      PolicyLookup: this.usePolicyLookup,
      ValidationExternalFile: this.useExternalFile,
      ValidationWeb: this.useWebValidation,
      WebValidationAVS: this.useWebValidationAVS,
      ValidationOther: this.useOtherValidation,
      DoTextExport: this.useTextExport,
      WebValidationOTH: this.useWebValidationOTH,
      PolicyFile: selectedFileLabel,
      PolicyLookupPath: this.policyLookupPath,
      WebValidationURL: this.validationUrl,
      OtherValidationNotes: this.notes,
    });

    console.log('Client Data updated in TabState:', {
      PolicyFile: selectedFileLabel,
      PolicyLookupPath: this.policyLookupPath,
      ValidationURL: this.validationUrl,
    });
  }
}
