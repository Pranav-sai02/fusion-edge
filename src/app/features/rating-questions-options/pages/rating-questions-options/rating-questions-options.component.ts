import { Component } from '@angular/core';
import { RatingQuestionOption } from '../../models/RatingQuestionOption';
import {
  CellClickedEvent,
  ColDef,
  DefaultMenuItem,
  GetContextMenuItemsParams,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  MenuItemDef,
} from 'ag-grid-community';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';

import { RatingQuestionOptionService } from '../../services/rating-question-option.service';
import { ViewButtonRendererComponent } from '../../../../shared/component/view-button-renderer/view-button-renderer.component';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';

@Component({
  selector: 'app-rating-questions-options',
  standalone: false,
  templateUrl: './rating-questions-options.component.html',
  styleUrl: './rating-questions-options.component.css',
})
export class RatingQuestionsOptionsComponent {
  rowData: RatingQuestionOption[] = [];
  gridApi!: GridApi;
  selectedOption: RatingQuestionOption | null = null;
  showPopup = false;
  isEditMode = false;

  columnDefs: ColDef[] = [
    {
      field: 'RatingQuestionType.QuestionType', // You can use this OR valueGetter
      headerName: 'Rating Question Type',
      flex: 2,
      minWidth: 300,
      valueGetter: (params) =>
        params.data?.RatingQuestionType?.QuestionType || '',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'QuestionOption',
      headerName: 'Question Option',
      flex: 1,
      minWidth: 200,
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },

    {
      field: 'QualifyingPrompt',
      headerName: 'Qualifying Prompt',
      flex: 1,
      minWidth: 200,
      cellStyle: {
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'RatingValue',
      headerName: 'Rating Value',
      flex: 1,
      minWidth: 200,
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'IsNoteRequired',
      headerName: 'Note Required',
      flex: 1,
      minWidth: 200,
      cellRenderer: 'activeToggleRenderer',
      cellRendererParams: (
        params: ICellRendererParams<RatingQuestionOption>
      ) => {
        return {
          isDisabled: true,
        };
      },
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      flex: 1,
      minWidth: 150,
      cellRenderer: 'activeToggleRenderer',
      cellRendererParams: (
        params: ICellRendererParams<RatingQuestionOption>
      ) => {
        return {
          isDisabled: true,
        };
      },
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      field: 'DoRaiseFlag',
      headerName: 'DoRaiseFlag',
      minWidth: 200,
      cellRenderer: 'activeToggleRenderer',
      cellRendererParams: (
        params: ICellRendererParams<RatingQuestionOption>
      ) => {
        return {
          isDisabled: true,
        };
      },
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
        fontSize: '17px',
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

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
  };

  components = {
    activeToggleRenderer: ActiveToggleRendererComponent,
    softDeleteRenderer: SoftDeleteButtonRendererComponent,
    viewButtonRenderer: ViewButtonRendererComponent,
  };

  constructor(
    private optionService: RatingQuestionOptionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadOptions();
  }

  loadOptions(): void {
    this.optionService.getRatingQuestionOptions().subscribe({
      next: (data) => {
        this.rowData = data
          .filter((option) => !option.IsDeleted)
          .sort(
            (a, b) =>
              (b.RatingQuestionOptionId ?? 0) - (a.RatingQuestionOptionId ?? 0)
          ); // ✅ Sort newest first
      },
      error: () => this.toastr.show('Failed to load options', 'error'),
    });
  }

  openAddPopup(): void {
    this.selectedOption = null; // or set default if needed
    this.isEditMode = false;
    this.showPopup = true;
  }

  openEditPopup(option: RatingQuestionOption): void {
    this.selectedOption = option;
    this.isEditMode = true;
    this.showPopup = true;
  }

  handlePopupClose(): void {
    this.showPopup = false;
    this.selectedOption = null;
    this.isEditMode = false;
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  confirmSoftDelete(option: RatingQuestionOption): void {
    if (!option?.RatingQuestionOptionId) {
      this.toastr.show('Invalid record (missing ID)', 'error');
      return;
    }

    const updatedOption: RatingQuestionOption = {
      ...option,
      IsDeleted: true,
    };

    this.optionService.updateRatingQuestionOption(updatedOption).subscribe({
      next: () => {
        this.toastr.show('Deleted successfully', 'success');
        this.loadOptions(); // 🔁 Refresh from API, ensures deleted is excluded
      },
      error: () => {
        this.toastr.show('Failed to delete on server', 'error');
      },
    });
  }

  getRowClass(params: any): string {
    return ''; // You can apply row-based classes here
  }

  onCellValueChanged(event: any): void {
    const updatedData: RatingQuestionOption = event.data;
    this.optionService.updateRatingQuestionOption(updatedData).subscribe({
      next: () => this.toastr.show('Updated successfully', 'success'),
      error: () => this.toastr.show('Update failed', 'error'),
    });
  }
}