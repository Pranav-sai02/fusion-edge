import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { RatingQuestionsListRoutingModule } from './rating-questions-list-routing.module';
import { RatingQuestionService } from './services/rating-questions.service';


import { RatingQuestionsListComponent } from './pages/rating-questions-list/rating-questions-list.component';
import { RatingQuestionsListPopupComponent } from './pages/rating-questions-list-popup/rating-questions-list-popup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [RatingQuestionsListComponent, RatingQuestionsListPopupComponent],
  imports: [
    CommonModule,
    RatingQuestionsListRoutingModule,
    AgGridModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  exports:[RatingQuestionsListComponent,RatingQuestionsListPopupComponent],
  providers: [RatingQuestionService],
})
export class RatingQuestionsListModule {}
