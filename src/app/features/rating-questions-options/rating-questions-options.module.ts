import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RatingQuestionsOptionsRoutingModule } from './rating-questions-options-routing.module';
import { RatingQuestionsOptionsComponent } from './pages/rating-questions-options/rating-questions-options.component';
import { RatingQuestionsOptionsPopupComponent } from './pages/rating-questions-options-popup/rating-questions-options-popup.component';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [RatingQuestionsOptionsComponent, RatingQuestionsOptionsPopupComponent],
  imports: [CommonModule,  ReactiveFormsModule, RatingQuestionsOptionsRoutingModule,AgGridModule, NgSelectModule],
  exports:[RatingQuestionsOptionsComponent,RatingQuestionsOptionsPopupComponent]
})
export class RatingQuestionsOptionsModule {}
