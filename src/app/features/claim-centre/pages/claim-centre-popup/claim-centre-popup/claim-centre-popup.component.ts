import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ClaimCentre } from '../../../models/ClaimCentre';
import { ClaimCentreService } from '../../../services/claim-centre-services/claim-centre.service';
import { ClientService } from '../../../../client-module/services/client-services/client.service';
import { ClientGroupService } from '../../../../client-module/services/client-group-services/client-group.service';
import { ClientGroup } from '../../../../client-module/models/ClientGroup';
import { Client } from '../../../../client-module/models/Client';
import { ToastrService } from '../../../../../shared/component/toastr/services/toastr.service';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

@Component({
  selector: 'app-claim-centre-popup',
  standalone: false,
  templateUrl: './claim-centre-popup.component.html',
  styleUrl: './claim-centre-popup.component.css',
})
export class ClaimCentrePopupComponent {
 @Input() initialData?: ClaimCentre;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<ClaimCentre>();
  @Input() isEditMode: boolean = false;

  providerForm!: FormGroup;
  clientGroup: ClientGroup[] = [];
  client: Client[] = [];

  provinces = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'Northern Cape',
    'North West',
    'Western Cape',
  ];

  CountryISO = CountryISO;
  searchFields = [SearchCountryField.All];

  constructor(
    private fb: FormBuilder,
    private claimCentreService: ClaimCentreService,
    private clientService: ClientService,
    private clientGroupService: ClientGroupService,
      private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.providerForm = this.fb.group({
      Name: [''],
      ClientGroupId: [null],
      Branch: [''],
      Address: [''],
      Telephone: [null],
      Fax: [null],
      TownCity: [''],
      Province: [null],
      IsActive: [false],
    });

  if (this.initialData) {
    const telParsed = this.initialData.Tel
      ? parsePhoneNumberFromString(this.initialData.Tel)
      : null;

    const faxParsed = this.initialData.Fax
      ? parsePhoneNumberFromString(this.initialData.Fax)
      : null;

    const formatTel = telParsed
      ? {
          number: telParsed.nationalNumber,
          internationalNumber: telParsed.number,
          countryCode: telParsed.country,        // Use 'IN', 'ZA', etc.
          dialCode: `+${telParsed.countryCallingCode}`,
        }
      : null;

    const formatFax = faxParsed
      ? {
          number: faxParsed.nationalNumber,
          internationalNumber: faxParsed.number,
          countryCode: faxParsed.country,
          dialCode: `+${faxParsed.countryCallingCode}`,
        }
      : null;

    this.providerForm.patchValue({
      ...this.initialData,
      Telephone: formatTel,
      Fax: formatFax,
    });
  }

    this.loadClientGroups();
  }

  loadClientGroups(): void {
    this.clientGroupService.getClientGroups().subscribe({
      next: (res) => {
        // Filter only active and not deleted client groups
        this.clientGroup = res.filter(
          (group) => group.IsActive && !group.IsDeleted
        );
      },
      error: (err) => console.error('Error loading client groups', err),
    });
  }
  onSubmit(): void {
    if (this.providerForm.valid) {
      const formData = { ...this.providerForm.value };

      // ✅ Convert ngx-intl-tel-input values to string
      formData.Tel = formData.Telephone?.internationalNumber || '';
      formData.Fax = formData.Fax?.internationalNumber || '';

      if (!formData.Tel) formData.Tel = '';
      if (!formData.Fax) formData.Fax = '';

      delete formData.Telephone;
      // delete formData.Fax;

      if (this.isEditMode && this.initialData?.ClaimCentreId) {
      // --- EDIT MODE ---
      this.claimCentreService
        .updateClaimCentre(this.initialData.ClaimCentreId, formData)
        .subscribe({
          next: (res) => {
            console.log('Updated successfully:', res);
            this.submit.emit(res);
            this.close.emit();
            this.toastrService.show('Claim Updated Successfully', 'success');
          },
          error: (err) => {
            console.error('Error updating claim centre:', err);
          },
        });
    } else {
      // --- ADD MODE ---
      this.claimCentreService.createClaimCentre(formData).subscribe({
        next: (res) => {
          console.log('Saved successfully:', res);
          this.submit.emit(res);
          this.close.emit();
          this.toastrService.show('Claim Added Successfully', 'success');
        },
        error: (err) => {
          console.error('Error saving claim centre:', err);
        },
      });
    }
    } else {
      this.providerForm.markAllAsTouched();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
