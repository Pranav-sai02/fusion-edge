import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimsComponent } from './pages/claims/claims.component';
import { ClaimsPopupComponent } from './pages/claims-popup/claims-popup/claims-popup.component';

const routes: Routes = [
  {
    path: 'claims',
    component: ClaimsComponent,
    title: 'Claims',
    data: { breadcrumb: 'Call Centre / Claims' },
  },
  {
    path: 'claims-popup',
    component: ClaimsPopupComponent,
    title: 'claims-popup',
    data: { breadcrumb: 'Call Centre / Claims' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimsRoutingModule {}
