// call-rating-ss2.component.ts
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';

type Scale = 'BAD' | 'FAIR' | 'GOOD';
type YesNo = 'YES' | 'NO';

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

   private fb = inject(FormBuilder);              // ✅ initialized before next line
  form: FormGroup = this.fb.group({
    contactName: [''],
    phone: [undefined, Validators.required],
  });
  @Input() caseRef = '';
  @Input() caseNumber = '';

  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<CallRatingSave>();

  // ===== Phone widget config =====
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;

  preferred = [CountryISO.India, CountryISO.SouthAfrica];
  searchFields = [SearchCountryField.All];
  selectedISO = CountryISO.SouthAfrica;

  

  

  questions: RatingQuestion[] = [
    { id: 1, text: 'How were you treated by the Agent when reporting the death?', type: 'scale', required: true },
    { id: 2, text: 'How were you dealt with by the Case Controller?', type: 'scale', required: true },
    { id: 3, text: 'How were you treated by the driver?', type: 'scale' },
    { id: 4, text: 'Was the deceased delivered to the final funeral home as requested?', type: 'yesno', required: true },
    { id: 5, text: 'What was the condition of the vehicle used to transport the deceased?', type: 'scale' },
    { id: 6, text: 'Was the transport to the final funeral home free of charge?', type: 'yesno' },
    { id: 7, text: 'How would you rate the service provided by the final funeral home?', type: 'scale' },
    { id: 8, text: 'Would you recommend this service to anyone?', type: 'yesno' },
  ];

  answers: Record<number, Scale | YesNo | null> =
    Object.fromEntries(this.questions.map(q => [q.id, null])) as any;

  get valid(): boolean {
    const requiredOk = this.questions.filter(q => q.required).every(q => this.answers[q.id] !== null);
    return this.form.valid && requiredOk;
  }

  onSave() {
    if (!this.valid) return;

    const phone = this.form.value.phone as any; // value shape from ngx-intl-tel-input
    const areaCode = (phone?.dialCode || '').replace('+', '');
    const telephone = (phone?.nationalNumber || '').toString().replace(/\s/g, '');

    this.save.emit({
      contactName: this.form.value.contactName ?? '',
      areaCode,
      telephone,
      answers: this.answers,
    });
  }

  trackById = (_: number, q: { id: number }) => q.id;
}
