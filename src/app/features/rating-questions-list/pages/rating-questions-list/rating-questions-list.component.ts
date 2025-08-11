import { Component, OnInit } from '@angular/core';
import {
  CellClickedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import { RatingQuestion } from '../../models/rating-questions.model';
import { RatingQuestionType } from '../../../rating-questions-types/models/rating-question-types.model';
import { RatingQuestionService } from '../../services/rating-questions.service';
import { RatingQuestionTypeService } from '../../../rating-questions-types/services/rating-question-types.service';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';

import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { ViewButtonRendererComponent } from '../../../../shared/component/view-button-renderer/view-button-renderer.component';

@Component({
  selector: 'app-rating-questions-list',
  standalone: false,
  templateUrl: './rating-questions-list.component.html',
  styleUrl: './rating-questions-list.component.css',
})
export class RatingQuestionsListComponent implements OnInit {
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;
  ViewButtonRendererComponent = ViewButtonRendererComponent;

  rowData: RatingQuestion[] = [];
  selectedOption: RatingQuestion | null = null;
  isEditMode = false;
  showPopup = false;
  gridApi!: GridApi;

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
    filter: true,
  };

  columnDefs: ColDef[] = [
    {
      field: 'Question',
      headerName: 'Question',
      minWidth: 350,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'RatingQuestionType.QuestionType',
      headerName: 'Rating Question Type',
      valueGetter: (params) =>
        params.data?.RatingQuestionType?.QuestionType || '',
      minWidth: 280,
      cellStyle: { textAlign: 'center', borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'ListRank',
      headerName: 'Rank',
      minWidth: 250,
      cellStyle: { textAlign: 'center', borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      minWidth: 250,
      cellRenderer: 'activeToggleRenderer',
      cellRendererParams: (params: ICellRendererParams<RatingQuestion>) => ({
        isDisabled: true,
      }),
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      suppressHeaderMenuButton: true,
      pinned: 'right',
      sortable: false,
      filter: false,
      flex: 1,
      maxWidth: 90,
      cellRenderer: 'viewButtonRenderer',
      onCellClicked: (params: CellClickedEvent) =>
        this.openEditPopup(params.data),
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      suppressHeaderMenuButton: true,
      pinned: 'right',
      sortable: false,
      filter: false,
      flex: 1,
      maxWidth: 100,
      cellRenderer: 'softDeleteRenderer',
      onCellClicked: (params: CellClickedEvent) =>
        this.confirmSoftDelete(params.data),
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
  ];

  constructor(
    private listService: RatingQuestionService,
    private ratingQuestionTypeService: RatingQuestionTypeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAllRatingQuestions();
  }

  loadAllRatingQuestions(): void {
    this.listService.getAll().subscribe({
      next: (res) => {
        this.rowData = res
          .filter((q) => !q.IsDeleted)
          .sort(
            (a, b) => (b.RatingQuestionId ?? 0) - (a.RatingQuestionId ?? 0)
          );
        // ⬅️ New rows first
      },
      error: () => {
        this.toastr.show('Failed to load questions', 'error');
      },
    });
  }

  openAddPopup(): void {
    this.selectedOption = null;
    this.isEditMode = false;
    this.showPopup = true;
  }

  openEditPopup(option: RatingQuestion): void {
    this.selectedOption = option;
    this.isEditMode = true;
    this.showPopup = true;
  }

  handlePopupClose(): void {
    this.showPopup = false;
    this.selectedOption = null;
    this.isEditMode = false;
  }

  handleDataSaved(): void {
    this.loadAllRatingQuestions(); // Refresh list
    this.handlePopupClose(); // Close popup
  }

  confirmSoftDelete(question: RatingQuestion): void {
    const updatedQuestion: RatingQuestion = {
      ...question,
      IsDeleted: true,
    };

    if (!updatedQuestion.RatingQuestionId) return;

    this.listService
      .update(updatedQuestion.RatingQuestionId, updatedQuestion)
      .subscribe({
        next: () => {
          this.toastr.show('Deleted successfully!', 'success');
          this.loadAllRatingQuestions();
        },
        error: () => {
          this.toastr.show('Delete failed.', 'error');
        },
      });
  }

  onGridReady(event: GridReadyEvent): void {
    this.gridApi = event.api;
    this.gridApi.sizeColumnsToFit();
  }
}