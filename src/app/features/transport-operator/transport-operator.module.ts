import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransportOperatorRoutingModule } from './transport-operator-routing.module';
import { TransportOperatorComponent } from './pages/transport-operator/transport-operator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    TransportOperatorComponent,
  ],
  imports: [
    CommonModule,
    TransportOperatorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule


  ],
})
export class TransportOperatorModule {}
