import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentsComponent } from './pages/documents/documents.component';
import { AgGridModule } from 'ag-grid-angular';
import { NgxsModule } from '@ngxs/store';
import { DocumentsState } from './state/documents.state';
import { DocumentsService } from './services/documents.service';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    DocumentsComponent
  ],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    AgGridModule,
    NgxsModule.forFeature([DocumentsState]),
  ],
  providers:[DocumentsService]
})
export class DocumentsModule { }
