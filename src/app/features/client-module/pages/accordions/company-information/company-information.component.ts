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
  @Output() close = new EventEmitter<void>();
  @Input() isEditMode: boolean = false;

  selectedFileName = '';
  selectedFile: File | null = null;
  currentFileUrl: string = '';

  clientGroup: ClientGroup[] = [];
  clientForm!: FormGroup;
  ProfileImage: string | ArrayBuffer | null = null;
  selectedValue: number | null = null;
  showSuccess = false;

  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  SearchCountryField = SearchCountryField;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  searchFields = [
    SearchCountryField.Name,
    SearchCountryField.DialCode,
    SearchCountryField.Iso2,
  ];

  dropdownOptions = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
  ];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private clientGroupService: ClientGroupService,
    public tabState: TabStateService
  ) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      CompanyName: ['', Validators.required],
      ClientGroupId: [null, Validators.required],
      Address: [''],
      Telephone: ['', Validators.required],
      Fax: [''],
      Mobile: ['', Validators.required],
      WebURL: [
        '',
        Validators.pattern(
          /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-])\/?$/i
        ),
      ],
      CompanyLogo: [''],
      IsActive: [true],
    });

    this.tabState
      .getCompanyInfo()
      .pipe(take(1))
      .subscribe((info) => {
        if (info) {
          this.clientForm.patchValue({
            CompanyName: info.ClientName || '',
            ClientGroupId: info.ClientGroupId || null,
            Address: info.Address || '',
            Telephone: info.Tel || '',
            Fax: info.Fax || '',
            Mobile: info.Mobile || '',
            WebURL: info.WebURL || '',
            CompanyLogo: info.CompanyLogo || '',
            IsActive: info.IsActive ?? true,
          });
          this.selectedValue = info.CompanyLogo ? +info.CompanyLogo : null;
          this.ProfileImage = info.CompanyLogo || null;
        }
      });

    this.clientForm.valueChanges.subscribe((values) => {
      this.tabState.updateCompanyInfo({
        ClientName: values.CompanyName,
        PrintName: values.CompanyName,
        ClientGroupId: values.ClientGroupId,
        Address: values.Address || '',
        Tel: values.Telephone?.e164Number || values.Telephone || '',
        Fax: values.Fax?.e164Number || values.Fax || '',
        Mobile: values.Mobile?.e164Number || values.Mobile || '',
        WebURL: values.WebURL || '',
        CompanyLogo: values.CompanyLogo || this.selectedValue?.toString() || '',
        IsActive: values.IsActive ?? true,
      });
    });

    this.clientGroupService.getClientGroups().subscribe({
      next: (groups) => {
        this.clientGroup = groups.filter(
          (group) => group.IsActive && !group.IsDeleted
        );
      },
      error: (err) => console.error('Failed to load client groups:', err),
    });
  }

  closeForm(): void {
    this.close.emit();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
    } else {
      this.selectedFile = null;
      this.selectedFileName = '';
    }
  }

  removeImage(): void {
    this.ProfileImage = '';
    this.clientForm.get('CompanyLogo')?.setValue('');
  }

  clearField(controlName: string): void {
    this.clientForm.get(controlName)?.setValue('');
  }
}
