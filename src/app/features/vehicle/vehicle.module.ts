import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleRoutingModule } from './vehicle-routing.module';
import { VehicleComponent } from './pages/vehicle/vehicle.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [VehicleComponent],
  imports: [CommonModule, VehicleRoutingModule,AgGridModule],
})
export class VehicleModule {}
