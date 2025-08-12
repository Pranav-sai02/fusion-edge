import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-aditional-costing',
  standalone: false,
  templateUrl: './add-aditional-costing.component.html',
  styleUrls: ['./add-aditional-costing.component.css']
})
export class AddAditionalCostingComponent {
 @Input() visible = false;
  @Output() save = new EventEmitter<{ cost: number; description: string }>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      cost: [null, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.save.emit(this.form.value);
  }

  onClose() { this.cancel.emit(); }
}
