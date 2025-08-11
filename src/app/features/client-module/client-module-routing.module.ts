import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './pages/client/client.component';
import { ClientGroupComponent } from './pages/client-group/client-group.component';
import { authGuard } from '../../core/guards/authguard/auth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'client',
        component: ClientComponent,
        canActivate: [authGuard],
        title: 'client',
        data: { breadcrumb: 'Client' },
      },
      {
        path: 'client-group',
        component: ClientGroupComponent,
        canActivate: [authGuard],
        title: 'client',
        data: { breadcrumb: 'Client / Client Group' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientModuleRoutingModule {}
