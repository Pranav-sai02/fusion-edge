import { Component } from '@angular/core';
import { ICellRenderer } from 'ag-grid-community';

@Component({
  selector: 'app-save-button-renderer',
  standalone: false,
  templateUrl: './save-button-renderer.component.html',
  styleUrl: './save-button-renderer.component.css'
})
export class SaveButtonRendererComponent implements ICellRenderer {
    params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onClick(): void {
    if (this.params.onClick instanceof Function) {
      this.params.onClick(this.params.data);
    }
  }

}
