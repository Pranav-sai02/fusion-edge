// link-documents-popup.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Documents } from '../../documents/models/Documents';
import { DocumentsService } from '../../documents/services/documents.service';
import { ClientDocument } from '../models/Client';
import { TabStateService } from '../services/tab-state-service/tab-state.service';


@Component({
  selector: 'app-link-documents-popup',
  standalone: false, // since you're declaring it in a module
  templateUrl: './link-documents-popup.component.html',
  styleUrls: ['./link-documents-popup.component.css']
})
export class LinkDocumentsPopupComponent implements OnInit {
  @Input() clientId!: number;

  @Output() close = new EventEmitter<void>();
  @Output() added = new EventEmitter<ClientDocument>();        // ✅ for (added)
  @Output() formSubmit = new EventEmitter<ClientDocument>();   // ✅ keep if parent still uses (formSubmit)

  documentForm: FormGroup;
  documentTypes: Documents[] = [];
  selectedFile: File | null = null;
  fileTouched = false;

  // ✅ used by template
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
    private documentService: DocumentsService,
    private tabState: TabStateService
  ) {
    this.documentForm = this.fb.group({
      DocumentId: ['', Validators.required],
      Note: [''],
      ListRank: [''],
    });
  }

  ngOnInit(): void {
    this.loadDocumentTypes();
  }

  private loadDocumentTypes(): void {
    this.documentService.getAll().pipe(take(1)).subscribe({
      next: (docs: Documents[]) =>
        this.documentTypes = docs.filter(d => d.IsActive && !d.IsDelete),
      error: (err) => console.error('Error loading document types', err),
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    this.selectedFile = fileInput.files && fileInput.files.length ? fileInput.files[0] : null;
    this.fileTouched = true;
  }

  async onSubmit(): Promise<void> {
    this.fileTouched = true;
    if (this.documentForm.invalid || !this.selectedFile) {
      this.documentForm.markAllAsTouched();
      return;
    }

    const docType = this.documentTypes.find(
      d => d.DocumentId === this.documentForm.value.DocumentId
    );

    const base64 = await this.fileToBase64(this.selectedFile);

    const clientDoc: ClientDocument = {
      ClientDocumentId: 0,
      ClientId: this.clientId ?? 0,
      DocumentId: this.documentForm.value.DocumentId,
      Note: this.stripHtml(this.documentForm.value.Note ?? ''),
      FileData: base64,
      FileName: this.selectedFile.name,
      ListRank: this.toNumber(this.documentForm.value.ListRank) ?? 0,
      IsDeleted: false,
      Document: {
        DocumentId: this.documentForm.value.DocumentId,
        Description: docType?.Description ?? 'N/A',
        IsActive: docType?.IsActive ?? true,
        IsDelete: docType?.IsDelete ?? false,
      },
    };

    // push into tab state so Save includes it
    this.tabState.documents$.pipe(take(1)).subscribe(cur => {
      this.tabState.setDocuments([...(cur ?? []), clientDoc]);
      // emit for parent UI feedback
      this.added.emit(clientDoc);
      this.formSubmit.emit(clientDoc);
      this.onClose();
    });
  }

  // ✅ used by template
  onCancel(): void {
    this.documentForm.reset();
    this.selectedFile = null;
    this.onClose();
  }

  // ✅ used by template
  get formControl() {
    return this.documentForm.controls;
  }

  onClose(): void {
    this.close.emit();
  }

  // helpers
  private stripHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html ?? '';
    return div.textContent || div.innerText || '';
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject('File read failed');
      reader.onload = () => resolve((reader.result as string).split(',')[1] ?? '');
      reader.readAsDataURL(file);
    });
  }

  private toNumber(value: any): number | null {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
}
