import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

import { RatingQuestionsTypesRoutingModule } from './rating-questions-types-routing.module';
import { RatingQuestionsTypesComponent } from './pages/rating-questions-types/rating-questions-types.component';

// NGXS State
import { NgxsModule } from '@ngxs/store';
import { RatingQuestionTypeState } from './state/rating-question-types.state';
import { RatingQuestionTypeService } from './services/rating-question-types.service';

@NgModule({
  declarations: [RatingQuestionsTypesComponent],
  imports: [
    CommonModule,
    RatingQuestionsTypesRoutingModule,
    AgGridModule,
    NgxsModule.forFeature([RatingQuestionTypeState]),
  ],
  providers: [RatingQuestionTypeService],
})
export class RatingQuestionsTypesModule {}
