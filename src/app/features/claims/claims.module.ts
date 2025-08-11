import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClaimsRoutingModule } from './claims-routing.module';
import { ClaimsComponent } from './pages/claims/claims.component';
import { ClaimsPopupComponent } from './pages/claims-popup/claims-popup/claims-popup.component';

@NgModule({
  declarations: [ClaimsComponent, ClaimsPopupComponent],
  imports: [CommonModule, ClaimsRoutingModule],
   exports: [ClaimsComponent,ClaimsPopupComponent],
})
export class ClaimsModule {}
