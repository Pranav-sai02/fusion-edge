import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-soft-delete-button-renderer',
  standalone: false,
  templateUrl: './soft-delete-button-renderer.component.html',
  styleUrl: './soft-delete-button-renderer.component.css',
})
export class SoftDeleteButtonRendererComponent
  implements ICellRendererAngularComp
{
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  // onClick(): void {
  //   if (this.params.onSoftDelete) {
  //     this.params.onSoftDelete(this.params.data);
  //   }
  // }
  onDelete(): void {
    if (
      this.params &&
      this.params.context &&
      this.params.context.componentParent
    ) {
      this.params.context.componentParent.softDeleteProvider(this.params.data);
    }
  }
}
