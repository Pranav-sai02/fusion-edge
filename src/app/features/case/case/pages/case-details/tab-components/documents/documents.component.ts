import { Component } from '@angular/core';
import { ColDef, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-documents',
  standalone: false,
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent {

selectedFile: File | null = null;

  // Updated structure to include fileName for proper AG Grid display
  uploadedFiles: {
    file: File;
    fileName: string;
    uploadedAt: Date;
  }[] = [];

  columnDefs: ColDef[] = [
    {
      headerName: 'File Name',
      field: 'fileName', // Use plain string instead of file.name
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Uploaded Date Time',
      field: 'uploadedAt',
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Download',
      cellRenderer: () => {
        return `<i class="fa fa-download download-icon" style="color: green; cursor: pointer;"></i>`;
      },
      onCellClicked: (params) => this.downloadFile(params.data),
      width: 100,
      cellStyle: { textAlign: 'center', verticalAlign: 'middle' },
    },
    {
      headerName: 'Delete',
      cellRenderer: () => {
        return `<i class="fa fa-trash delete-icon" style="color: red; cursor: pointer;"></i>`;
      },
      onCellClicked: (params) => this.deleteFile(params.data),
      width: 100,
      cellStyle: { textAlign: 'center', verticalAlign: 'middle' },
    },
  ];

  defaultColDef: ColDef = {
    headerClass: 'bold-header',
    sortable: true,
    filter: true,
    resizable: true,
    cellStyle: {
      borderRight: '1px solid #ccc',
    },
  };

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(fileInput: HTMLInputElement): void {
    if (this.selectedFile) {
      this.uploadedFiles = [
        ...this.uploadedFiles,
        {
          file: this.selectedFile,
          fileName: this.selectedFile.name,
          uploadedAt: new Date(),
        },
      ];
      this.selectedFile = null;
      fileInput.value = '';
    }
  }

  printPage(): void {
    window.print();
  }

  downloadFile(fileData: { file: File }): void {
    const file = fileData.file;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  deleteFile(fileData: any): void {
    this.uploadedFiles = this.uploadedFiles.filter((f) => f !== fileData);
  }

  onGridReady(params: GridReadyEvent): void {
    params.api.sizeColumnsToFit();
  }
}

