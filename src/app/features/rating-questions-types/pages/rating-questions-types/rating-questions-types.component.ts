import { Component, OnInit } from '@angular/core';
import {
  CellClickedEvent,
  CellValueChangedEvent,
  ColDef,
  GetContextMenuItems,
  GetContextMenuItemsParams,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { Store } from '@ngxs/store';
import { RatingQuestionType } from '../../models/rating-question-types.model';
import {
  AddRatingQuestionType,
  LoadRatingQuestionTypes,
  SoftDeleteRatingQuestionType,
  UpdateRatingQuestionType,
} from '../../state/rating-question-types.action';
import { RatingQuestionTypeState } from '../../state/rating-question-types.state';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';
import { SaveButtonRendererComponent } from '../../../../shared/component/save-button-renderer/save-button-renderer.component';

@Component({
  selector: 'app-rating-questions-types',
  templateUrl: './rating-questions-types.component.html',
  standalone: false,
  styleUrls: ['./rating-questions-types.component.css'],
})
export class RatingQuestionsTypesComponent implements OnInit {
  gridApi!: GridApi;
  rowData: RatingQuestionType[] = [];

  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;
  SaveButtonRendererComponent = SaveButtonRendererComponent;

  defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    filter: true,
  };

  columnDefs: ColDef<RatingQuestionType>[] = [
    {
      field: 'QuestionType',
      headerName: 'Question Type',
      editable: true,
      minWidth: 250,
      cellEditor: 'agTextCellEditor',
      valueFormatter: (params) => params.value || 'Enter Type',
      cellClassRules: { 'hint-text': (params) => !params.value },
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      cellRenderer: 'activeToggleRenderer',
      minWidth: 100,
      cellStyle: { textAlign: 'center', borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'IncludeInRatingCalcs',
      headerName: 'Include in Rating Calcs',
      cellRenderer: 'activeToggleRenderer',
      minWidth: 200,
      cellStyle: { textAlign: 'center', borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      suppressHeaderMenuButton:true,
      pinned: 'right',
      sortable: false,
      filter: false,
      flex: 1,
      maxWidth: 90,
      cellRenderer: 'saveButtonRenderer',
      onCellClicked: (params: CellClickedEvent<RatingQuestionType>) => {
        if (params.data) this.saveRow(params.data);
      },
      cellStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },
    {
      
      suppressHeaderMenuButton:true,
      pinned: 'right',
      sortable: false,
      filter: false,
      flex: 1,
      maxWidth: 100,
      cellRenderer: 'softDeleteRenderer',
      onCellClicked: (params: CellClickedEvent<RatingQuestionType>) => {
        if (params.data) this.softDeleteRow(params.data);
      },
      cellStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRight: '1px solid #ccc',
      },
      headerClass: 'bold-header',
    },
  ];

  constructor(private store: Store, private toasterService: ToastrService) {}

 ngOnInit(): void {
  this.store.dispatch(new LoadRatingQuestionTypes());
  this.store
    .select(RatingQuestionTypeState.getRatingQuestionTypes)
    .subscribe((data) => {
      this.rowData = [...data].sort(
        (a, b) => (b.RatingQuestionTypeId ?? 0) - (a.RatingQuestionTypeId ?? 0)
      );
    });
}


  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  onCellValueChanged(event: CellValueChangedEvent<RatingQuestionType>): void {
    const updatedRow = event.data;
    const index = this.rowData.findIndex(
      (r) =>
        r === updatedRow ||
        r.RatingQuestionTypeId === updatedRow.RatingQuestionTypeId
    );

    if (index > -1) {
      this.rowData[index].IsEdited = true;
      this.gridApi.applyTransaction({ update: [this.rowData[index]] });
    }
  }

  saveRow(row: RatingQuestionType): void {
    const isComplete =
      row.QuestionType?.trim() &&
      row.IncludeInRatingCalcs !== undefined &&
      row.IsActive !== undefined;

    if (!isComplete) {
      this.toasterService.show(
        'Please complete all fields before saving.',
        'warning'
      );
      return;
    }

    const isNew = !row.RatingQuestionTypeId;

    if (!isNew && !row.IsEdited) {
      this.toasterService.show('No changes to save.', 'info');
      return;
    }

    if (isNew) {
      this.store.dispatch(new AddRatingQuestionType(row));
    } else {
      this.store.dispatch(new UpdateRatingQuestionType(row));
    }

    this.toasterService.show('Saved successfully!', 'success');
    row.IsEdited = false;
    this.gridApi.applyTransaction({ update: [row] });
  }

  softDeleteRow(row: RatingQuestionType): void {
    if (!row.RatingQuestionTypeId) {
      this.rowData = this.rowData.filter((r) => r !== row);
      this.gridApi.applyTransaction({ remove: [row] });
    } else {
      this.store.dispatch(new SoftDeleteRatingQuestionType(row));
      this.toasterService.show('Removed successfully!', 'success');
    }
  }

 addRow(): void {
  const newRow: RatingQuestionType = {
    RatingQuestionTypeId: 0,
    QuestionType: '',
    IsActive: true,
    IncludeInRatingCalcs: true,
  };

  // Add the row via grid API at index 0 (top)
  this.gridApi.applyTransaction({
    add: [newRow],
    addIndex: 0, // 👈 Add it to the first row
  });

  // Optionally: update rowData to stay in sync if needed
  this.rowData = [newRow, ...this.rowData];

  // Optional: Scroll to top and flash
  setTimeout(() => {
    this.gridApi.ensureIndexVisible(0, 'top');
    const firstRow = this.gridApi.getDisplayedRowAtIndex(0);
    if (firstRow) {
      this.gridApi.flashCells({ rowNodes: [firstRow] });
    }
  }, 100);
}



  getContextMenuItems: GetContextMenuItems = (
    params: GetContextMenuItemsParams
  ) => {
    return [
      {
        name: 'Add Row',
        action: () => this.addRow(),
        icon: '<i class="fas fa-plus"></i>',
      },
      {
        name: 'Delete Row',
        action: () => {
          if (params.node?.data) this.softDeleteRow(params.node.data);
        },
        icon: '<i class="fas fa-trash"></i>',
      },
      'separator',
      'copy',
      'export',
    ];
  };
}