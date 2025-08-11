import { Component, EventEmitter, Output } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ToastrService } from '../toastr/services/toastr.service';

@Component({
  selector: 'app-unlink-cell-renderer',
  standalone: false,
  templateUrl: './unlink-cell-renderer.component.html',
  styleUrl: './unlink-cell-renderer.component.css',
})
export class UnlinkCellRendererComponent implements ICellRendererAngularComp {
  params: any;

  @Output() unlinkClicked = new EventEmitter<any>();

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    return true;
  }

  onUnlink(): void {
    if (this.params?.onUnlink) {
      this.params.onUnlink(this.params.data);
    } else {
      console.warn('Unlink callback not provided.');
    }
  }
}
