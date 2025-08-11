import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientModuleRoutingModule } from './client-module-routing.module';
import { ClientDetailsComponent } from './pages/client-details/client-details.component';
import { ClientComponent } from './pages/client/client.component';
import { ClientGroupComponent } from './pages/client-group/client-group.component';
import { ClientPopupComponent } from './pages/client-popup/client-popup.component';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ClientTabComponent } from './pages/client-tab/client-tab.component';

import { ClientServicesComponent } from './pages/client-services/client-services.component';

import { DocumentsComponent } from './pages/documents/documents.component';
import { ClaimCentreComponent } from './pages/claim-centre/claim-centre.component';
import { ServiceProviderComponent } from './pages/service-provider/service-provider.component';
import { ClaimControllerComponent } from './pages/claim-controller/claim-controller.component';
import { RatingQuestionsComponent } from './pages/rating-questions/rating-questions.component';
import { CompanyInformationComponent } from './pages/accordions/company-information/company-information.component';
import { ClaimInformationComponent } from './pages/accordions/claim-information/claim-information.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { QuillModule } from 'ngx-quill';
import { quillDefaultModules } from '../../shared/config/text-editor-config';
import { CustomLabelsComponent } from './pages/accordions/custom-labels/custom-labels.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ClientDataComponent } from './pages/accordions/client-data/client-data.component';
import { CallAssignmentSetupComponent } from './pages/accordions/call-assignment-setup/call-assignment-setup.component';
import { RatingQuestionsOptionsModule } from '../rating-questions-options/rating-questions-options.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { LinkServicePopupComponent } from './link-service-popup/link-service-popup.component';
import { LinkDocumentsPopupComponent } from './link-documents-popup/link-documents-popup.component';

@NgModule({
  declarations: [
    ClientDetailsComponent,
    ClientComponent,
    ClientGroupComponent,
    ClientPopupComponent,
    ClientTabComponent,

    ClientServicesComponent,
    LinkServicePopupComponent,
    DocumentsComponent,
    ClaimCentreComponent,
    ServiceProviderComponent,
    ClaimControllerComponent,
    RatingQuestionsComponent,
    CompanyInformationComponent,
    ClaimInformationComponent,
    CustomLabelsComponent,
    ClientDataComponent,
    CallAssignmentSetupComponent,
    LinkServicePopupComponent,
    LinkDocumentsPopupComponent,
  ],
  imports: [
    CommonModule,
    ClientModuleRoutingModule,
    HttpClientModule,
    AgGridModule,
    ReactiveFormsModule,
    FormsModule,
    EditorModule,
    NgxIntlTelInputModule,
    MatExpansionModule,
    NgSelectModule,
    QuillModule.forRoot({ modules: quillDefaultModules }),
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  exports: [ClientPopupComponent],
})
export class ClientModuleModule {}
