import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './pages/documents/documents.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'documents',
        component: DocumentsComponent,
        title: 'Documents',
        data: { breadcrumb: 'Configuration / Documents' },
      },
    ],
  },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
     RouterModule.forChild(routes),
  ]
})
export class DocumentsRoutingModule { }
