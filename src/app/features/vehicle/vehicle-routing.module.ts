import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleComponent } from './pages/vehicle/vehicle.component';
import { authGuard } from '../../core/guards/authguard/auth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'vehicle',
        component: VehicleComponent,
        canActivate: [authGuard],
        title: 'vehicle',
        data: { breadcrumb: 'Vehicle' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleRoutingModule {}
