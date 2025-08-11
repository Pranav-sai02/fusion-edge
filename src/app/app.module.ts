import { ErrorHandler, NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { SidebarComponent } from './layouts/sidebar/pages/sidebar/sidebar.component';
import { HeaderComponent } from './layouts/header/pages/header/header.component';
import { HomeComponent } from './features/home/pages/home/home.component';
import { LoginComponent } from './features/auth/login/loginpage/login/login.component';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from './layouts/layoutcomponent/layout/layout.component';
import { UserComponent } from './features/users/pages/user/user.component';
import { UserFilterToolbarComponent } from './features/users/pages/user-filter-toolbar/user-filter-toolbar.component';
import { UserpopupComponent } from './features/users/pages/userpopup/userpopup/userpopup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ActiveToggleRendererComponent } from './shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { ServiceProviderModule } from './features/service-provider/service-provider.module';
import { SoftDeleteButtonRendererComponent } from './shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { ViewButtonRendererComponent } from './shared/component/view-button-renderer/view-button-renderer.component';
import { AreaCodesComponent } from './features/areacodes/pages/area-codes/area-codes.component';
import { BreadcrumbComponent } from './layouts/breadcrumb/breadcrumb.component';
import { AreacodePopupComponent } from './features/areacodes/pages/areacode-popup/areacode-popup.component';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import { EditorModule } from 'primeng/editor';
import { NgxsModule } from '@ngxs/store';
import { AreaCodesState } from './features/areacodes/state/area-code.state';

import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ConfirmDialogComponent } from './shared/component/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GlobalErrorHandler } from './core/error-handlers/global-error-handler';
import { CaseModule } from './features/case/case.module';
import { CustomButtonComponent } from './shared/component/custom-button/custom-button.component';
import { CustomInputComponent } from './shared/component/custom-input/custom-input.component';
import { BodyLocationsComponent } from './features/body-locations/pages/body-locations/body-locations.component';
import { ClaimsModule } from './features/claims/claims.module';
import { ServiceProviderTypesState } from './features/service-provider/state/service-provider-types.state';
import { BranchesState } from './features/branches/state/branch.state';
import { BranchesComponent } from './features/branches/pages/branches/branches.component';
import { ClaimCentreComponent } from './features/claim-centre/pages/claim-centre/claim-centre.component';
import { ClaimCentrePopupComponent } from './features/claim-centre/pages/claim-centre-popup/claim-centre-popup/claim-centre-popup.component';
import { BodyLocationsState } from './features/body-locations/state/body-locations.state';
import { ClientModuleModule } from './features/client-module/client-module.module';
import { ClientGroupState } from './features/client-module/client-group-state/client-group.state';
import { VehicleModule } from './features/vehicle/vehicle.module';
import { TransportOperatorModule } from './features/transport-operator/transport-operator.module';
import { QuillModule } from 'ngx-quill';
import { quillDefaultModules } from './shared/config/text-editor-config';
import { CompanyDetailsComponent } from './features/company-details/pages/company-details/company-details.component';
import { TransportOperatorState } from './features/transport-operator/state/transport-operator.state';
import { VehicleState } from './features/vehicle/state/vehicle.state';
import { RatingQuestionsOptionsModule } from './features/rating-questions-options/rating-questions-options.module';
import { RatingQuestionsListModule } from './features/rating-questions-list/rating-questions-list.module';
import { RatingQuestionsTypesModule } from './features/rating-questions-types/rating-questions-types.module';
import { RatingQuestionTypeState } from './features/rating-questions-types/state/rating-question-types.state';
import { FileLinkRendererComponent } from './shared/component/file-link-renderer/file-link-renderer.component';
import { DocumentsState } from './features/documents/state/documents.state';
import { DocumentsModule } from './features/documents/documents.module';
import { ToastrComponent } from './shared/component/toastr/pages/toastr/toastr.component';
import { ToastrContainerComponent } from './shared/component/toastr/pages/toastr-container/toastr-container.component';
import { TooltipModule } from 'primeng/tooltip';
import { SaveButtonRendererComponent } from './shared/component/save-button-renderer/save-button-renderer.component';
import { UnlinkCellRendererComponent } from './shared/component/unlink-cell-renderer/unlink-cell-renderer.component';
import { NgSelectModule } from '@ng-select/ng-select';

//import { AuthInterceptor } from './core/interceptors/authinterceptor/auth.interceptor';
ModuleRegistry.registerModules([AllEnterpriseModule]);

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    LayoutComponent,
    UserComponent,
    UserFilterToolbarComponent,
    UserpopupComponent,
    ActiveToggleRendererComponent,
    SoftDeleteButtonRendererComponent,
    ViewButtonRendererComponent,
    AreaCodesComponent,
    BreadcrumbComponent,
    AreacodePopupComponent,

    ConfirmDialogComponent,
    CustomButtonComponent,
    CustomInputComponent,
    BodyLocationsComponent,
    BranchesComponent,
    ClaimCentreComponent,
    ClaimCentrePopupComponent,
    CompanyDetailsComponent,
    FileLinkRendererComponent,
    ToastrComponent,
    ToastrContainerComponent,
    SaveButtonRendererComponent,
    UnlinkCellRendererComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    EditorModule,
    TooltipModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    ServiceProviderModule,
    NgxIntlTelInputModule,
    NgxsModule.forRoot([
      AreaCodesState,
      ClientGroupState,
      ServiceProviderTypesState,
      BranchesState,
      BodyLocationsState,
      TransportOperatorState,
      VehicleState,
      RatingQuestionTypeState,
      DocumentsState,
    ]),
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    CaseModule,
    ClaimsModule,
    ClientModuleModule,
    VehicleModule,
    TransportOperatorModule,
    RatingQuestionsOptionsModule,
    RatingQuestionsListModule,
    RatingQuestionsTypesModule,
    DocumentsModule,

    QuillModule.forRoot({ modules: quillDefaultModules }),
    NgSelectModule,
  ],

  providers: [
    provideClientHydration(withEventReplay()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },

    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true,
    // },
  ],
  exports: [
    ToastrContainerComponent,
    SoftDeleteButtonRendererComponent,
    SaveButtonRendererComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
