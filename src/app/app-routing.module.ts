import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './features/home/pages/home/home.component';
import { LoginComponent } from './features/auth/login/loginpage/login/login.component';
import { SidebarComponent } from './layouts/sidebar/pages/sidebar/sidebar.component';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard.component';
import { loginGuard } from './core/guards/loginguard/login.guard';
import { authGuard } from './core/guards/authguard/auth.guard';
import { LayoutComponent } from './layouts/layoutcomponent/layout/layout.component';
import { UserComponent } from './features/users/pages/user/user.component';
import { AreaCodesComponent } from './features/areacodes/pages/area-codes/area-codes.component';

import { BranchesComponent } from './features/branches/pages/branches/branches.component';
import { BodyLocationsComponent } from './features/body-locations/pages/body-locations/body-locations.component';
import { ClaimCentreComponent } from './features/claim-centre/pages/claim-centre/claim-centre.component';
import { CompanyDetailsComponent } from './features/company-details/pages/company-details/company-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
    title: 'Login',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuard],
        title: 'Home',
        data: { breadcrumb: 'Home' },
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        title: 'Dashboard',
        data: { breadcrumb: 'Dashboard' },
      },

      {
        path: 'users',
        component: UserComponent,
        canActivate: [authGuard],
        title: 'User',
        data: { breadcrumb: 'Security / Users' },
      },
      {
        path: 'area-codes',
        component: AreaCodesComponent,
        canActivate: [authGuard],
        title: 'Area Codes',
        data: { breadcrumb: 'Configuration / AreaCodes' },
      },
      {
        path: 'company-details',
        component: CompanyDetailsComponent,
        canActivate: [authGuard],
        title: 'Company Details',
        data: { breadcrumb: 'Company / Company Details' },
      },

      {
        path: 'services',
        loadChildren: () =>
          import('./features/service-provider/service-provider.module').then(
            (m) => m.ServiceProviderModule
          ),
        canActivate: [authGuard],
      },
      {
        path: 'cases',
        loadChildren: () =>
          import('./features/case/case.module').then((m) => m.CaseModule),
      },

      {
        path: 'claims',
        loadChildren: () =>
          import('./features/claims/claims.module').then((m) => m.ClaimsModule),
      },
      {
        path: 'claim-centre',
        component: ClaimCentreComponent,
        canActivate: [authGuard],
        title: 'claim-centre',
        data: { breadcrumb: 'Configuration / Claim Centre' },
      },
      {
        path: 'branches',
        component: BranchesComponent,
        canActivate: [authGuard],
        title: 'branches',
        data: { breadcrumb: 'Configuration / Branches' },
      },
      {
        path: 'body-location',
        component: BodyLocationsComponent,
        canActivate: [authGuard],
        title: 'body-locations',
        data: { breadcrumb: 'Configuration / Body Locations' },
      },
      {
        path: 'client',
        loadChildren: () =>
          import('./features/client-module/client-module.module').then(
            (m) => m.ClientModuleModule
          ),
      },
      {
        path: 'vehicle',
        loadChildren: () =>
          import('./features/vehicle/vehicle.module').then(
            (m) => m.VehicleModule
          ),
      },
      {
        path: 'transport-operator',
        loadChildren: () =>
          import(
            './features/transport-operator/transport-operator.module'
          ).then((m) => m.TransportOperatorModule),
      },

      {
        path: 'list',
        loadChildren: () =>
          import(
            './features/rating-questions-list/rating-questions-list.module'
          ).then((m) => m.RatingQuestionsListModule),
      },
      {
        path: 'types',
        loadChildren: () =>
          import(
            './features/rating-questions-types/rating-questions-types.module'
          ).then((m) => m.RatingQuestionsTypesModule),
      },
      {
        path: 'options',
        loadChildren: () =>
          import(
            './features/rating-questions-options/rating-questions-options.module'
          ).then((m) => m.RatingQuestionsOptionsModule),
      },
      {
        path: 'documents',
        loadChildren: () =>
          import('./features/documents/documents.module').then(
            (m) => m.DocumentsModule
          ),
      },

      { path: '**', redirectTo: 'login' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
