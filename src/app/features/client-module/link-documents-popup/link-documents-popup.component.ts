import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentsService } from '../../documents/services/documents.service';
import { Documents } from '../../documents/models/Documents';

@Component({
  selector: 'app-link-documents-popup',
  standalone: false,
  templateUrl: './link-documents-popup.component.html',
  styleUrl: './link-documents-popup.component.css'
})
export class LinkDocumentsPopupComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<any>();

  documentForm: FormGroup;
  documentTypes: Documents[] = [];
  selectedFile: File | null = null;
  fileTouched = false;

  // ✅ Rich text editor toolbar modules
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

  constructor(private fb: FormBuilder, private documentService: DocumentsService) {
    this.documentForm = this.fb.group({
      DocumentId: ['', Validators.required],
      Note: [''],
      ListRank: [''] // Optional
    });
  }

  ngOnInit(): void {
    this.loadDocumentTypes();
  }

  loadDocumentTypes(): void {
    this.documentService.getAll().subscribe({
      next: (document:Documents[])=>{
        this.documentTypes = document.filter((document)=> document.IsActive && !document.IsDelete);
      },

      error: (err)=>{
        console.error('Error loading document types', err)
      }
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
    this.fileTouched = true;
  }

  onSubmit(): void {
    this.fileTouched = true;

    if (this.documentForm.invalid || !this.selectedFile) {
      this.documentForm.markAllAsTouched();
      return;
    }

 const selectedDocType = this.documentTypes.find(
    (d) => d.DocumentId === this.documentForm.value.DocumentId
  );

  const doc: Documents = {
    DocumentId: this.documentForm.value.DocumentId,
    Description: selectedDocType?.Description ?? 'N/A',
    FileName: this.selectedFile.name,
    FileUrl: URL.createObjectURL(this.selectedFile),
    ListRank: this.documentForm.value.ListRank,
    IsDelete: false,
    IsActive: true,
    // Add other required fields if needed
  };

  this.formSubmit.emit(doc);
    this.onClose();
  }

  stripHtmlTags(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  onCancel(): void {
    this.documentForm.reset();
    this.selectedFile = null;
    this.onClose();
  }

  onClose(): void {
    this.close.emit();
  }

  get formControl() {
    return this.documentForm.controls;
  }
}
