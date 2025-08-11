import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RatingQuestionsOptionsComponent } from './pages/rating-questions-options/rating-questions-options.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'options',
        component: RatingQuestionsOptionsComponent,
        title: 'Options',
        data: { breadcrumb: 'Rating Questions / Options' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RatingQuestionsOptionsRoutingModule {}
