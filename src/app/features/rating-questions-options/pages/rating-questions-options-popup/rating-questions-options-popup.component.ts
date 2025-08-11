import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';
import { RatingQuestionOption } from '../../models/RatingQuestionOption';
import { RatingQuestionTypeService } from '../../../rating-questions-types/services/rating-question-types.service';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { RatingQuestionOptionService } from '../../services/rating-question-option.service';
import { RatingQuestionType } from '../../../rating-questions-types/models/rating-question-types.model';

@Component({
  selector: 'app-rating-questions-options-popup',
  standalone: false,
  templateUrl: './rating-questions-options-popup.component.html',
  styleUrl: './rating-questions-options-popup.component.css',
})
export class RatingQuestionsOptionsPopupComponent implements OnInit {
  @Input() initialData: RatingQuestionOption | null = null;
  @Input() isEditMode: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  providerForm!: FormGroup;
  questionTypes: RatingQuestionType[] = [];
  predefinedOptions: string[] = [];

  constructor(
    private fb: FormBuilder,
    private questionTypeService: RatingQuestionTypeService,
    private optionsService: RatingQuestionOptionService,
    private toastr: ToastrService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRatingQuestionTypes();

    this.providerForm
      .get('RatingQuestionTypeId')
      ?.valueChanges.subscribe((selectedId) => {
        const selectedType = this.questionTypes.find(
          (q) => q.RatingQuestionTypeId === Number(selectedId)
        );
        this.predefinedOptions = this.getOptionsByType(
          selectedType?.QuestionType || ''
        );

        const questionOptionCtrl = this.providerForm.get('QuestionOption');

        if (this.predefinedOptions.length > 0) {
          questionOptionCtrl?.setValue(this.predefinedOptions[0]);
        } else {
          questionOptionCtrl?.setValue('');
        }

        questionOptionCtrl?.setValidators([
          Validators.required,
          this.dropdownOnlyValidator(),
        ]);
        questionOptionCtrl?.updateValueAndValidity();
      });
  }

  initForm(): void {
    this.providerForm = this.fb.group({
      RatingQuestionOptionId: [null],
      RatingQuestionTypeId: ['', Validators.required],
      QuestionOption: ['', [Validators.required, this.dropdownOnlyValidator()]],
      QualifyingPrompt: [''],
      RatingValue: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      IsNoteRequired: [false],
      DoRaiseFlag: [false],
      IsActive: [false],
    });

    if (this.initialData) {
      this.providerForm.patchValue({
        RatingQuestionOptionId: this.initialData.RatingQuestionOptionId || null,
        RatingQuestionTypeId: this.initialData.RatingQuestionTypeId || '',
        QuestionOption: this.initialData.QuestionOption || '',
        QualifyingPrompt: this.initialData.QualifyingPrompt || '',
        RatingValue: this.initialData.RatingValue || '',
        IsNoteRequired: this.initialData.IsNoteRequired || false,
        DoRaiseFlag: this.initialData.DoRaiseFlag || false,
        IsActive: this.initialData.IsActive || false,
      });
    }
  }

  private loadRatingQuestionTypes(): void {
    this.questionTypeService.getAll().subscribe({
      next: (data) => {
        this.questionTypes = data.filter((q) => !q.IsDeleted && q.IsActive); // ✅ Filter out deleted ones
      },
      error: () => {
        this.toastr.show('Failed to load question types', 'error');
      },
    });
  }

  getOptionsByType(type: string): string[] {
    switch (type.trim().toLowerCase()) {
      case 'good/bad':
        return ['Good', 'Bad'];
      case 'satisfied/unsatisfied':
        return ['Satisfied', 'Unsatisfied'];
      case 'excellent/good/fair/poor':
        return ['Excellent', 'Good', 'Fair', 'Poor'];
      case 'excellent/good':
        return ['Excellent', 'Good'];
      case 'yes/no' :
        return ['Yes', 'No'];
      case 'pass/fail' :
        return ['Pass','Fail'];
      default:
        return [];
    }
  }

  dropdownOnlyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!this.predefinedOptions || this.predefinedOptions.length === 0) {
        return null; // allow any value if no predefined list
      }
      return this.predefinedOptions.includes(control.value)
        ? null
        : { invalidDropdownValue: true };
    };
  }

  onSubmit(): void {
    if (this.providerForm.invalid) {
      this.providerForm.markAllAsTouched();
      console.warn('Form is invalid', this.providerForm.value);
      return;
    }

    const formData = this.providerForm.value;

    const payload: RatingQuestionOption = {
      RatingQuestionOptionId: formData.RatingQuestionOptionId || 0,
      RatingQuestionTypeId: Number(formData.RatingQuestionTypeId),
      QuestionOption: formData.QuestionOption.trim(),
      QualifyingPrompt: formData.QualifyingPrompt?.trim() || '',
      RatingValue: Number(formData.RatingValue),
      IsNoteRequired: formData.IsNoteRequired,
      DoRaiseFlag: formData.DoRaiseFlag,
      IsActive: formData.IsActive,
    };

    const serviceCall = this.isEditMode
      ? this.optionsService.updateRatingQuestionOption(payload)
      : this.optionsService.createRatingQuestionOption(payload);

    serviceCall.subscribe({
      next: () => {
        const msg = this.isEditMode
          ? 'Rating Question Option updated successfully'
          : 'Rating Question Option created successfully';
        this.toastr.show(msg, 'success');
        this.submit.emit();
        this.close.emit();
      },
      error: (err) => {
        const action = this.isEditMode ? 'Update' : 'Create';
        console.error(`${action} failed:`, err);
        this.logger.logError(err, `${action} RatingQuestionOption`);
        this.toastr.show(`${action} failed`, 'error');
      },
    });
  }

  onClose(): void {
    this.providerForm.reset();
    this.close.emit();
  }
}