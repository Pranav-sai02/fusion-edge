import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceProvidersComponent } from '../service-providers/pages/service-providers/service-providers.component';
import { ServiceProvidersTypesComponent } from '../service-provider-types/pages/service-providers-types/service-providers-types.component';
import { RouterModule, Routes } from '@angular/router';
import { ServicesPageComponent } from '../services-page/pages/services-page/services-page.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'service-providers',
        component: ServiceProvidersComponent,
        title: 'Service Providers',
        data: { breadcrumb: 'Services / Service Providers' },
      },
      {
        path: 'service-types',
        component: ServiceProvidersTypesComponent,
        title: 'Service Types',
        data: { breadcrumb: 'Services / Service Types' },
      },
      {
        path: 'services',

        component: ServicesPageComponent,
        title: 'Services',
        data: { breadcrumb: 'Services' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceProviderRoutingModule {}
