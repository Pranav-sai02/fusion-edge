import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseRoutingModule } from './case-routing.module';
import { CaseDetailsComponent } from './case/pages/case-details/case-details/case-details.component';
import { CaseComponent } from './case/pages/case/case.component';
import { CasePopupComponent } from './case/pages/case-popup/case-popup/case-popup.component';
import { CallerComponent } from './case/pages/case-details/tab-components/caller/caller/caller.component';
import { ComplaintsComponent } from './case/pages/case-details/tab-components/complaints/complaints.component';
import { DocumentsComponent } from './case/pages/case-details/tab-components/documents/documents.component';
import { ValidationComponent } from './case/pages/case-details/tab-components/validation/validation.component';
import { VoucherSmsComponent } from './case/pages/case-details/tab-components/voucher-sms/voucher-sms.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { AgGridModule } from 'ag-grid-angular';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ServiceDetailsAccordionComponent } from './case/pages/case-details/tab-components/caller/service-details-accordion/service-details-accordion/service-details-accordion.component';
import { AddPhase1Component } from './case/pages/case-details/tab-components/add-phase1/add-phase1.component';
import { AddPhase2Component } from './case/pages/case-details/tab-components/add-phase2/add-phase2.component';
import { AddPhase3Component } from './case/pages/case-details/tab-components/add-phase3/add-phase3.component';
import { AddPhase4Component } from './case/pages/case-details/tab-components/add-phase4/add-phase4.component';
import { CaseStagesComponent } from './case/pages/case-details/case-stages/case-stages.component';
import { VehicleTrackerComponent } from './case/pages/case-details/vehicle-tracker/vehicle-tracker.component';
import { DynamicCaseTabsComponent } from './case/pages/case-details/dynamic-case-tabs/dynamic-case-tabs.component';
import { MatMenuModule } from '@angular/material/menu';
import { CallerCaseHeaderComponent } from './case/pages/caller-case-header/caller-case-header.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgSelectModule } from '@ng-select/ng-select';
import { CauseOfDeathComponent } from './case/pages/case-details/tab-components/cause-of-death/cause-of-death.component';
import { DeceasedInfoComponent } from './case/pages/case-details/tab-components/deceased-info/deceased-info.component';
import { AdditionalCostComponent } from './case/pages/caller-case-header/additional-costing/aditional-costing/aditional-costing.component';
import { AddAditionalCostingComponent } from './case/pages/caller-case-header/additional-costing/add-aditional-costing/add-aditional-costing.component';


@NgModule({
  declarations: [
    CaseComponent,
    CaseDetailsComponent,
    CasePopupComponent,
    CallerComponent,
    ComplaintsComponent,
    DocumentsComponent,
    ValidationComponent,
    VoucherSmsComponent,
    ServiceDetailsAccordionComponent,
    AddPhase1Component,
    AddPhase2Component,
    AddPhase3Component,
    AddPhase4Component,
    CaseStagesComponent,
    VehicleTrackerComponent,
    DynamicCaseTabsComponent,
    CallerCaseHeaderComponent,
    CauseOfDeathComponent,
    DeceasedInfoComponent,
    AdditionalCostComponent,
    AddAditionalCostingComponent,

  ],
  imports: [

    CommonModule,
    CaseRoutingModule,
    AgGridModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FloatLabelModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxIntlTelInputModule,
    MatExpansionModule,
    MatMenuModule,
    MatButtonToggleModule,
    NgSelectModule
  ],
  exports: [CaseComponent, CaseDetailsComponent, CasePopupComponent],
})
export class CaseModule {}
