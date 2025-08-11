import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesPageService } from '../../services/service-page/services-page.service';
import { ServicesPage } from '../../models/Services-page';
import { LoggerService } from '../../../../../core/services/logger/logger.service';
import { ServiceProviderTypes } from '../../../service-provider-types/models/ServiceProviderTypes';
import { ServiceProviderTypesService } from '../../../service-provider-types/services/serviceProvider-types/service-provider-types.service';
import { ToastrService } from '../../../../../shared/component/toastr/services/toastr.service';

@Component({
  selector: 'app-services-page-popup',
  standalone: false,
  templateUrl: './services-page-popup.component.html',
  styleUrl: './services-page-popup.component.css',
})
export class ServicesPagePopupComponent implements OnInit {
  @Input() service: ServicesPage | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<any>();
  @Input() isEditMode: boolean = false;

  serviceTypes: ServiceProviderTypes[] = [];

  servicesPageForm: FormGroup;

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  constructor(
    private fb: FormBuilder,
    private serviceSvc: ServicesPageService,
    private toastr: ToastrService,
    private logger: LoggerService,
    private serviceProviderTypesservice: ServiceProviderTypesService
  ) {
    this.servicesPageForm = this.fb.group({
      ServiceId: [null], // Added ServiceId to the form
      Description: ['', [Validators.required, Validators.minLength(3)]],
      ServiceType: ['', Validators.required],
      Note: ['', Validators.required],
      EnforceMobileNumber: [false],
      SendRefSMSEnabled: [false],
      IsActive: [false],
    });
  }

ngOnInit(): void {
    this.serviceProviderTypesservice.getAll().subscribe((services) => {
      // ✅ Filter active and non-deleted types
      this.serviceTypes = services.filter(
        (s) => s.IsActive && !s.IsDelete
      );

      if (this.service) {
        const matchedType = services.find(
          (t) => t.Description === this.service!.ServiceType
        );

        this.servicesPageForm.patchValue({
          ServiceId: this.service.ServiceId,
          Description: this.service.Description,
          ServiceType: matchedType?.ServiceProviderTypeId || null, // ✅ Fix here
          Note: this.service.Note,
          EnforceMobileNumber: this.service.EnforceMobileNumber,
          SendRefSMSEnabled: this.service.SendRefSMSEnabled,
          IsActive: this.service.IsActive,
        });
      }
    });
  }

 onSubmit() {
  if (this.servicesPageForm.invalid) {
    this.servicesPageForm.markAllAsTouched();
    const firstInvalidControl = document.querySelector('.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }

  const formData = this.servicesPageForm.value;

const selectedType = this.serviceTypes.find(
  (t) => t.ServiceProviderTypeId === formData.ServiceType // ✅ Fix here
);

const payload: ServicesPage = {
  ServiceId: formData.ServiceId,
  Description: formData.Description,
  ServiceType: selectedType?.Description || '', // ✅ Use string name
  Note: formData.Note,
  NotePlain: this.stripHtmlTags(formData.Note),
  EnforceMobileNumber: formData.EnforceMobileNumber,
  SendRefSMSEnabled: formData.SendRefSMSEnabled,
  IsActive: formData.IsActive,
  IsDelete: formData.IsDelete
};

  const isUpdating = formData.ServiceId && formData.ServiceId > 0;

  const request$ = isUpdating
    ? this.serviceSvc.updateService(formData.ServiceId, payload)
    : this.serviceSvc.createService(payload);

  request$.subscribe({
    next: (response) => {
      this.toastr.show(
        isUpdating ? 'Service updated successfully!' : 'Service created successfully!',
        'success'
      );
      this.formSubmit.emit(response);
      this.close.emit();
    },
    error: (err) => {
      console.error('Failed to save service:', err);
      this.logger.logError(err, 'ServicesPagePopupComponent:onSubmit');
      this.toastr.show('Failed to save service. Please try again.', 'error');
    },
  });
}

  private stripHtmlTags(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  onCancel() {
    this.servicesPageForm.reset();
    this.close.emit();
  }

  onClose() {
    this.servicesPageForm.reset();
    this.close.emit();
  }

  get formControl() {
    return this.servicesPageForm.controls;
  }
}