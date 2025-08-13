import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

type Scale = 'BAD' | 'FAIR' | 'GOOD';
type YesNo  = 'YES' | 'NO';

interface RatingQuestion {
  id: number;
  text: string;
  type: 'scale' | 'yesno';
  required?: boolean;
}

export type CallRatingSave = {
  contactName: string;
  areaCode: string;   // dial code without '+', e.g. "27"
  telephone: string;  // national number, e.g. "4352254234"
  answers: Record<number, Scale | YesNo | null>;
};

@Component({
  selector: 'app-call-rating-ss2',
  standalone: false,
  templateUrl: './call-rating-ss2.component.html',
  styleUrls: ['./call-rating-ss2.component.css'],
})
export class CallRatingSs2Component {
  private fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    contactName: [''],
    phone: [undefined, Validators.required],
  });

  @Input() caseRef = '';
  @Input() caseNumber = '';

  @Output() cancel = new EventEmitter<void>();
  @Output() save   = new EventEmitter<CallRatingSave>();

  // Phone widget config
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  preferred   = [CountryISO.India, CountryISO.SouthAfrica];
  searchFields = [SearchCountryField.All];
  selectedISO = CountryISO.SouthAfrica;

  // Questions (static)
  questions: RatingQuestion[] = [
    // { id: 1, text: 'How were you treated by the Agent when reporting the death?', type: 'scale', required: true },
  //   { id: 2, text: 'How were you dealt with by the Case Controller?', type: 'scale', required: true },
  //   { id: 3, text: 'How were you treated by the driver?', type: 'scale' },
  //   { id: 4, text: 'Was the deceased delivered to the final funeral home as requested?', type: 'yesno', required: true },
  //   { id: 5, text: 'What was the condition of the vehicle used to transport the deceased?', type: 'scale' },
  //   { id: 6, text: 'Was the transport to the final funeral home free of charge?', type: 'yesno' },
  //   { id: 7, text: 'How would you rate the service provided by the final funeral home?', type: 'scale' },
  //   { id: 8, text: 'Would you recommend this service to anyone?', type: 'yesno' },
  ];

  // keep answers map (not wired to radios yet since static)
  answers: Record<number, Scale | YesNo | null> =
    Object.fromEntries(this.questions.map(q => [q.id, null])) as any;

  // AG Grid
  columnDefs: ColDef<RatingQuestion>[] = [
    {
      headerName: 'Question',
      field: 'text',
      flex: 2,
      wrapText: true,
      autoHeight: true,
      cellClass: 'q-text-cell',
    },
    {
      headerName: 'Options',
      field: 'type',
      flex: 1,
      cellRenderer: (params: { data: { id: any; }; value: string; }) => {
        const id = params.data.id;
        if (params.value === 'scale') {
          return `
            <div class="opt-wrap">
              <label class="chip"><input type="radio" name="q${id}"> BAD</label>
              <label class="chip"><input type="radio" name="q${id}"> FAIR</label>
              <label class="chip"><input type="radio" name="q${id}"> GOOD</label>
            </div>`;
        }
        return `
          <div class="opt-wrap">
            <label class="chip"><input type="radio" name="q${id}"> NO</label>
            <label class="chip"><input type="radio" name="q${id}"> YES</label>
          </div>`;
      }
    }
  ];

  defaultColDef: ColDef = {
    sortable: false,
    filter: false,
    resizable: true,
    suppressMovable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  };

  rowData: RatingQuestion[] = this.questions;
  private gridApi?: GridApi<RatingQuestion>;

  onGridReady(e: GridReadyEvent<RatingQuestion>) {
    this.gridApi = e.api;
    e.api.sizeColumnsToFit();
  }

  // Radios are static for now; just require phone to enable Update
  get valid(): boolean {
    return this.form.valid;
  }

  onSave() {
    if (!this.valid) return;

    const phone = this.form.value.phone as any;
    const areaCode  = (phone?.dialCode || '').replace('+', '');
    const telephone = (phone?.nationalNumber || '').toString().replace(/\s/g, '');

    this.save.emit({
      contactName: this.form.value.contactName ?? '',
      areaCode,
      telephone,
      answers: this.answers,
    });
  }
}
