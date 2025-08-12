import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { Client } from '../../../models/Client';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from '../../../services/client-services/client.service';
import { ClientGroup } from '../../../models/ClientGroup';
import { ClientGroupService } from '../../../services/client-group-services/client-group.service';
import { TabStateService } from '../../../services/tab-state-service/tab-state.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-company-information',
  standalone: false,
  templateUrl: './company-information.component.html',
  styleUrl: './company-information.component.css',
})
export class CompanyInformationComponent {
  @Input() clientToEdit!: Client;
  @Input() isEditMode = false;
  @Output() close = new EventEmitter<void>();

  showSuccess = false;
currentFileUrl = '';

  clientForm!: FormGroup;

  // image/file UX
  selectedFileName = '';
  selectedFile: File | null = null;
  ProfileImage: string | ArrayBuffer | null = null;

  // lookup lists
  clientGroup: ClientGroup[] = [];
  selectedValue: number | null = null;

  // phone input settings
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  SearchCountryField = SearchCountryField;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  searchFields = [SearchCountryField.Name, SearchCountryField.DialCode, SearchCountryField.Iso2];

  // simple dropdown demo (keep if needed)
  dropdownOptions = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
  ];

  constructor(
    private fb: FormBuilder,
    private clientGroupService: ClientGroupService,
    public tabState: TabStateService
  ) {}

  ngOnInit(): void {
    // form controls (keep names UI-friendly, map to Client fields on patch)
    this.clientForm = this.fb.group({
      CompanyName: ['', Validators.required],
      ClientGroupId: [null, Validators.required],
      Address: [''],
      Telephone: ['', Validators.required],
      Fax: [''],
      Mobile: ['', Validators.required],
      WebURL: [
        '',
        // lightweight URL pattern (http/https optional)
        Validators.pattern(/^(https?:\/\/)?([\w.-]+)\.[a-z]{2,}(\/[\w./#-]*)?$/i),
      ],
      CompanyLogo: [''],
      IsActive: [true],
    });

    // load existing company info from tab state (once)
    this.tabState.companyInfo$.pipe(take(1)).subscribe((info: Partial<Client>) => {
      if (!info) return;
      this.clientForm.patchValue({
        CompanyName: info.ClientName ?? '',
        ClientGroupId: info.ClientGroupId ?? null,
        Address: info.Address ?? '',
        Telephone: info.Tel ?? '',
        Fax: info.Fax ?? '',
        Mobile: info.Mobile ?? '',
        WebURL: info.WebURL ?? '',
        CompanyLogo: info.CompanyLogo ?? '',
        IsActive: info.IsActive ?? true,
      });
      this.selectedValue = info.CompanyLogo ? Number(info.CompanyLogo) : null;
      this.ProfileImage = info.CompanyLogo ?? null;
    });

    // keep tab state in sync with form (merge patch)
    this.clientForm.valueChanges.subscribe((v) => {
      this.tabState.patchCompanyInfo({
        ClientName: v.CompanyName,
        PrintName: v.CompanyName,
        ClientGroupId: v.ClientGroupId,
        Address: v.Address ?? '',
        Tel: this.toE164(v.Telephone),
        Fax: this.toE164(v.Fax),
        Mobile: this.toE164(v.Mobile),
        WebURL: v.WebURL ?? '',
        CompanyLogo: v.CompanyLogo || this.selectedValue?.toString() || '',
        IsActive: v.IsActive ?? true,
      });
    });

    // populate client groups
    this.clientGroupService.getClientGroups().subscribe({
      next: (groups) => {
        this.clientGroup = groups.filter((g) => g.IsActive && !g.IsDeleted);
      },
      error: (err) => console.error('Failed to load client groups:', err),
    });
  }

  // close popup/panel
  closeForm(): void {
    this.close.emit();
  }

  // file picker for company logo (stores file name + preview)
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;

      // optional: preview
      const reader = new FileReader();
      reader.onload = () => (this.ProfileImage = reader.result);
      reader.readAsDataURL(this.selectedFile);

      // if your API expects base64 in CompanyLogoData, uncomment:
      // reader.onloadend = () => {
      //   const dataUrl = reader.result as string;
      //   const base64 = dataUrl.split(',')[1] ?? '';
      //   this.tabState.patchCompanyInfo({ CompanyLogoData: base64 });
      // };
    } else {
      this.selectedFile = null;
      this.selectedFileName = '';
    }
  }

  removeImage(): void {
    this.ProfileImage = '';
    this.clientForm.get('CompanyLogo')?.setValue('');
    // also clear from state if you want
    this.tabState.patchCompanyInfo({ CompanyLogo: '', CompanyLogoData: null });
  }

  clearField(controlName: string): void {
    this.clientForm.get(controlName)?.setValue('');
  }

  // turn ngx-intl-tel-input value or plain string into E.164 string
  private toE164(val: any): string {
    if (!val) return '';
    // when using ngx-intl-tel-input, control value can be an object with e164Number
    if (typeof val === 'object' && val.e164Number) return val.e164Number as string;
    return String(val);
  }
}
