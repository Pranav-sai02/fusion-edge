import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-deceased-info',
  standalone: false,
  templateUrl: './deceased-info.component.html',
  styleUrl: './deceased-info.component.css',
})
export class DeceasedInfoComponent {
  deathForm!: FormGroup; // ✅ non-null assertion used to satisfy TypeScript

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.deathForm = this.fb.group({
      policyNumber: [''],
      relationship: ['OTHER'],
      initials: ['', Validators.required],
      firstName: [''],
      lastName: [''],
      idNumber: ['', Validators.required],
      passportNumber: [''],
      gender: [''],
      dob: [''],
      dod: [''],
      age: [''],
      placeOfDeath: [''],
      deathProvince: ['Gauteng', Validators.required],
      bodyLocation: [''],
      bodyProvince: ['Gauteng', Validators.required],
      locationType: ['Funeral Parlour'],
      telephone: [''],
      burialTown: [''],
      province: ['Free State'],
      country: ['South Africa'],
    });
  }
}
