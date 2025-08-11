import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-company-details',
  standalone: false,
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.css',
})
export class CompanyDetailsComponent {
  form: FormGroup;
  currentFileUrl: string = '';
  selectedFileName = '';

  selectedFile: File | null = null;
  showModal = true;

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

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      physicalAddress: [''],
      postalAddress: [''],
    });
  }

  ngOnInit(): void {}

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

  onSubmit(): void {
    console.log('Form data:', this.form.value);
    if (this.selectedFile) {
      console.log('Selected file:', this.selectedFile.name);
    }
    this.showModal = false;
  }

  onClose(): void {
    this.showModal = false;
  }
}
