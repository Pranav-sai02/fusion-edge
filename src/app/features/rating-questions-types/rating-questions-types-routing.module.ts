import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RatingQuestionsTypesComponent } from './pages/rating-questions-types/rating-questions-types.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'types',
        component: RatingQuestionsTypesComponent,
        title: 'Types',
        data: { breadcrumb: 'Rating Questions / Types' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RatingQuestionsTypesRoutingModule {}
