import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesPage } from '../../service-provider/services-page/models/Services-page';
import { ServicesPageService } from '../../service-provider/services-page/services/service-page/services-page.service';

@Component({
  selector: 'app-link-service-popup',
  standalone: false,
  templateUrl: './link-service-popup.component.html',
  styleUrl: './link-service-popup.component.css'
})
export class LinkServicePopupComponent implements OnInit {
  @Input() selectedService: ServicesPage | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<any>();

  servicePage: ServicesPage[] = [];

  clientServiceForm: FormGroup;

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
      ['clean']
    ]
  };

  constructor(
    private fb: FormBuilder,
    private servicePageService: ServicesPageService
  ) {
    this.clientServiceForm = this.fb.group({
      ServiceId: ['', Validators.required],
      Note: ['', Validators.required],
      TransferNumber: ['']
    });
  }

  ngOnInit(): void {
  this.loadServiceTypes();

  // When a service is selected, patch Note with NotePlain
  this.clientServiceForm.get('ServiceId')?.valueChanges.subscribe((selectedServiceId) => {
    const selectedService = this.servicePage.find(service => service.ServiceId === selectedServiceId);
    
    if (selectedService) {
      this.clientServiceForm.patchValue({
        Note: selectedService.NotePlain || '' // auto fill rich text editor
      });
    }
  });
}

  get selectedServiceDescription(): string {
    const selectedId = this.clientServiceForm.get('ServiceId')?.value;
    const selectedService = this.servicePage.find(s => s.ServiceId === +selectedId);
    return selectedService?.Description || '';
  }

  private loadServiceTypes(): void {
    this.servicePageService.getAllServices().subscribe({
      next: (services: ServicesPage[]) => {  // ✅ use ServicesPage[] here
        this.servicePage = services.filter((service)=>service.IsActive && !service.IsDelete);
        
      },
      error: (err) => {
        console.error('❌ Failed to load service types:', err);
      }
    });
  }

 onSubmit(): void {
  if (this.clientServiceForm.invalid) {
    this.clientServiceForm.markAllAsTouched();
    return;
  }

  const formValue = this.clientServiceForm.value;
  const selectedId = formValue.ServiceId;

  const selectedService = this.servicePage.find(s => s.ServiceId === +selectedId);

  if (!selectedService) return;

  const payload = {
    ServiceId: selectedService.ServiceId,
    Description: selectedService.Description, // ✅ this is what AG Grid displays
    Note: formValue.Note,
    NotePlain: this.stripHtmlTags(formValue.Note),
    TransferNumber: formValue.TransferNumber
  };

  this.formSubmit.emit(payload); // ✅ emits full service object
  this.onClose();
}


  private stripHtmlTags(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  onCancel(): void {
    this.clientServiceForm.reset();
    this.onClose();
  }

  onClose(): void {
    this.close.emit();
  }

  get formControl() {
    return this.clientServiceForm.controls;
  }
}