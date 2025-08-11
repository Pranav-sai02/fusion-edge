import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-active-toggle-renderer',
  standalone: false,
  templateUrl: './active-toggle-renderer.component.html',
  styleUrl: './active-toggle-renderer.component.css',
})
export class ActiveToggleRendererComponent implements ICellRendererAngularComp {
  params: any;
  isDisabled:boolean = false;

  agInit(params: any): void {
    this.params = params;
    this.isDisabled = params.isDisabled ?? false;
  }

  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  toggleStatus() {
    const newValue = !this.params.value;
    this.params.node.setDataValue(this.params.colDef.field, newValue);

    if (this.params.context && this.params.context.componentParent) {
      this.params.context.componentParent.onToggleActive(
        this.params.data.id,
        newValue
      );
    }
  }
}
