import { Component, ElementRef, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-file-link-renderer',
  standalone: false,
  templateUrl: './file-link-renderer.component.html',
  styleUrl: './file-link-renderer.component.css',
})
export class FileLinkRendererComponent implements ICellRendererAngularComp {
  params: any;
  fileName: string = '';
  fileUrl: string | null = null;

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  agInit(params:ICellRendererParams): void {
    this.params = params;
    this.fileName = params.data?.FileName ?? '';
    this.fileUrl = params.data?.FileUrl ?? null;
  }

  refresh(): boolean {
    return false;
  }

  triggerFileUpload(): void {
    this.fileInputRef.nativeElement.click();
  }

  viewFile(): void {
  if (this.fileUrl) {
    window.open(this.fileUrl, '_blank');
  }
}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.fileName = file.name;
      console.log('Uploading file for row:', this.params.data);
      console.log('File name:', file.name);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('serviceId', this.params.data.ServiceId);
       this.fileUrl = URL.createObjectURL(file);
    }
  }
  clearFileName(): void {
    this.fileName = '';

      if (this.fileUrl) {
    URL.revokeObjectURL(this.fileUrl);
    this.fileUrl = null;
  }

    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = ''; // ✅ Clear the input's value
    }
  }
}
