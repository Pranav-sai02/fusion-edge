import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AreaCodesService } from '../../services/areacodes/area-codes.service';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';

@Component({
  selector: 'app-areacode-popup',
  standalone: false,
  templateUrl: './areacode-popup.component.html',
  styleUrl: './areacode-popup.component.css',
})
export class AreacodePopupComponent {
  areaForm: FormGroup;

  @Output() close = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private areaCodeService: AreaCodesService,
    private toasterService: ToastrService
  ) {
    this.areaForm = this.fb.group({
      areaCode: ['', Validators.required],
      description: [''],
      type: ['Landline'],
      isActive: [false],
    });
  }

  onSubmit() {
    if (this.areaForm.invalid) {
      this.areaForm.markAllAsTouched();
      this.toasterService.show('Please fill in required fields.', 'error');
      return;
    }

    const formData = this.areaForm.value;

    this.areaCodeService.addAreaCode(formData).subscribe({
      next: (response) => {
        this.toasterService.show('Area code saved successfully!', 'success');
        this.formSubmit.emit(response);
        this.close.emit();
      },
      error: (err) => {
        console.error('Save error:', err);
        this.toasterService.show('Failed to save area code.', 'error');
      },
    });
  }

  onCancel() {
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }

  get formControls() {
    return this.areaForm.controls;
  }
}
