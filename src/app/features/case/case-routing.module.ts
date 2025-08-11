import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseComponent } from './case/pages/case/case.component';
import { CaseDetailsComponent } from './case/pages/case-details/case-details/case-details.component';
import { CasePopupComponent } from './case/pages/case-popup/case-popup/case-popup.component';

const routes: Routes = [
  {
    path: '',
    component: CaseComponent,
    title: 'Cases',
    data: { breadcrumb: 'Call Centre / Cases' },
  },
  {
    path: 'case-details', // No :callRef
    component: CaseDetailsComponent,
    title: 'Case Details',
    data: { breadcrumb: 'Call Centre / Cases / Case Details' },
  },
  {
    path: 'new',
    component: CasePopupComponent,
    title: 'New Case',
    data: { breadcrumb: 'Call Centre / Cases / New Case' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseRoutingModule {}
