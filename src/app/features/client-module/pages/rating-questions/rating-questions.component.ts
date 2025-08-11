import { UnlinkCellRendererComponent } from './../../../../shared/component/unlink-cell-renderer/unlink-cell-renderer.component';
import { Component, OnInit } from '@angular/core';
import {
  CellClickedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { RatingQuestionService } from '../../../rating-questions-list/services/rating-questions.service';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';
import { FormBuilder, FormGroup } from '@angular/forms';

import { RatingQuestion, ClientRatingQuestion } from '../../models/Client';
import { TabStateService } from '../../services/tab-state-service/tab-state.service';

@Component({
  selector: 'app-rating-questions',
  standalone: false,
  templateUrl: './rating-questions.component.html',
  styleUrls: ['./rating-questions.component.css'],
})
export class RatingQuestionsComponent implements OnInit {
  gridApi!: GridApi;
  rowData: ClientRatingQuestion[] = [];
  allQuestions: RatingQuestion[] = [];

  form: FormGroup;
  ratingQuestionsList: { id: number; name: string }[] = [];

  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  UnlinkCellRendererComponent = UnlinkCellRendererComponent;

  columnDefs: ColDef<ClientRatingQuestion>[] = [
    {
      headerName: 'Question',
      minWidth: 250,
      valueGetter: (params) =>
        this.getQuestionText(params.data?.RatingQuestionId),
      headerClass: 'bold-header',
    },
    {
      field: 'ListRank',
      headerName: 'Rank',
      minWidth: 100,
      cellStyle: { textAlign: 'center' },
      headerClass: 'bold-header',
    },
    {
      headerName: 'Active',
      minWidth: 150,
      valueGetter: (params) => {
        const q = this.allQuestions.find(
          (x) => x.RatingQuestionId === params.data?.RatingQuestionId
        );
        return q?.IsActive ? 'Yes' : 'No';
      },
      cellRenderer: 'activeToggleRenderer',
      headerClass: 'bold-header',
    },
    {
      headerName: 'Delete',
      maxWidth: 100,
      cellRenderer: 'unlinkCellRenderer',
      cellRendererParams: {
        onUnlink: (data: ClientRatingQuestion) => this.softDelete(data),
      },
      headerClass: 'bold-header',
    },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
    cellStyle: {
      borderRight: '1px solid #ccc',
      display: 'flex',
      alignItems: 'center',
    },
  };

  constructor(
    private listservice: RatingQuestionService,
    private toaster: ToastrService,
    private fb: FormBuilder,
    private tabState: TabStateService
  ) {
    this.form = this.fb.group({
      selectedRatingQuestion: [null],
    });
  }

  ngOnInit(): void {
    this.loadAllQuestions().then(() => {
      this.tabState.getRatingQuestions().subscribe((questions) => {
        this.rowData = [...questions];
        if (this.gridApi) {
          this.gridApi.setGridOption('rowData', this.rowData);
        }
      });
    });
  }

  onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    this.gridApi.setGridOption('rowData', this.rowData);
  }

  /** Master question loader */
  private loadAllQuestions(): Promise<void> {
    return new Promise((resolve) => {
      this.listservice.getAll().subscribe({
        next: (data) => {
          this.allQuestions = data.map((q) => ({
            RatingQuestionId: q.RatingQuestionId ?? 0,
            RatingQuestionTypeId: q.RatingQuestionTypeId ?? 0,
            RatingQuestionType: q.RatingQuestionType,
            Question: q.Question,
            IsActive: q.IsActive,
            ListRank: q.ListRank ?? 0,
          }));

          this.ratingQuestionsList = this.allQuestions
            .filter((q) => q.IsActive)
            .map((q) => ({
              id: q.RatingQuestionId,
              name: q.Question,
            }));

          resolve();
        },
        error: () => {
          this.toaster.show('Failed to load questions', 'error');
          resolve(); // prevent blocking
        },
      });
    });
  }

  onAddSelectedQuestion(): void {
    const selectedId = this.form.value.selectedRatingQuestion;

    if (!selectedId) {
      this.toaster.show('Please select a question to add', 'warning');
      return;
    }

    const exists = this.rowData.some((r) => r.RatingQuestionId === selectedId);
    if (exists) {
      this.toaster.show('This question is already added', 'info');
      return;
    }

    const found = this.allQuestions.find(
      (q) => q.RatingQuestionId === selectedId
    );
    if (!found) {
      this.toaster.show('Selected question not found', 'error');
      return;
    }

    const newItem: ClientRatingQuestion = {
      ClientRatingQuestionId: 0,
      ClientId: 0,
      RatingQuestionId: found.RatingQuestionId,
      ListRank: found.ListRank ?? 0,
      IsDeleted: false,
    };

    const updated = [...this.rowData, newItem];
    this.rowData = updated;
    this.tabState.updateRatingQuestions(updated);
    this.form.get('selectedRatingQuestion')?.reset();
    this.toaster.show('Question added successfully', 'success');
  }

  softDelete(row: ClientRatingQuestion): void {
    if (!row?.RatingQuestionId) {
      this.toaster.show('Invalid record (missing ID)', 'error');
      return;
    }

    const updated = this.rowData.filter(
      (r) => r.RatingQuestionId !== row.RatingQuestionId
    );
    this.rowData = updated;
    this.tabState.updateRatingQuestions(updated);
    this.toaster.show('Item unlinked successfully', 'success');
  }

  private getQuestionText(id: number | undefined): string {
    return (
      this.allQuestions.find((q) => q.RatingQuestionId === id)?.Question ?? ''
    );
  }
}
