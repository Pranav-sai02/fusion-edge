import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RatingQuestionsListComponent } from './pages/rating-questions-list/rating-questions-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: RatingQuestionsListComponent ,
        title: 'List',
        data: { breadcrumb: 'Rating Questions / List' },
      },
    
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RatingQuestionsListRoutingModule {}
