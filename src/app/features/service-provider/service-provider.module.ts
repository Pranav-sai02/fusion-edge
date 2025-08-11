import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { ServiceProviderRoutingModule } from './service-provider-routing/service-provider-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { ServiceProvidersComponent } from './service-providers/pages/service-providers/service-providers.component';
import { ServiceProvidersTypesComponent } from './service-provider-types/pages/service-providers-types/service-providers-types.component';
import { ServicesPageComponent } from './services-page/pages/services-page/services-page.component';
import { ServiceProvidersPopupComponent } from './service-providers/pages/service-providers-popup/service-providers-popup.component';
import { ServiceProviderTypesPopupComponent } from './service-provider-types/pages/service-provider-types-popup/service-provider-types-popup.component';
import { ServicesPagePopupComponent } from './services-page/pages/services-page-popup/services-page-popup.component';
import { EditorModule } from 'primeng/editor';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    ServiceProvidersComponent,
    ServiceProvidersTypesComponent,
    ServicesPageComponent,
    ServiceProvidersPopupComponent,
    ServiceProviderTypesPopupComponent,
    ServicesPagePopupComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AgGridModule,
    ServiceProviderRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    EditorModule,
    NgxIntlTelInputModule,
    NgSelectModule,
  ],
  exports: [
    ServiceProvidersPopupComponent, // <-- export it here
    ServiceProviderTypesPopupComponent,
    ServicesPagePopupComponent,
  ],
})
export class ServiceProviderModule {}
