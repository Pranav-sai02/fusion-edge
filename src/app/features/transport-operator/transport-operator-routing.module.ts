import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportOperatorComponent } from './pages/transport-operator/transport-operator.component';
import { authGuard } from '../../core/guards/authguard/auth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'transport',
        component: TransportOperatorComponent,
        canActivate: [authGuard],
        title: 'transport-operator',
        data: { breadcrumb: 'Transport Operator' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransportOperatorRoutingModule {}
