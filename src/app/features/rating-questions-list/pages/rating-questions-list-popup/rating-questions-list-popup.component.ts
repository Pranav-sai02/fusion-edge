import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RatingQuestion } from '../../models/rating-questions.model';
import { RatingQuestionType } from '../../../rating-questions-types/models/rating-question-types.model';
import { RatingQuestionTypeService } from '../../../rating-questions-types/services/rating-question-types.service';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { RatingQuestionService } from '../../services/rating-questions.service';

@Component({
  selector: 'app-rating-questions-list-popup',
  standalone: false,
  templateUrl: './rating-questions-list-popup.component.html',
  styleUrls: ['./rating-questions-list-popup.component.css'],
})
export class RatingQuestionsListPopupComponent implements OnInit {
  @Input() initialData: RatingQuestion | null = null;
  @Input() isEditMode: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() dataSaved = new EventEmitter<void>();

  providerForm!: FormGroup;
  questionTypes: RatingQuestionType[] = [];

  constructor(
    private fb: FormBuilder,
    private questionService: RatingQuestionService,
    private questionTypeService: RatingQuestionTypeService,
    private toastr: ToastrService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadQuestionTypes();
  }

  initForm(): void {
    this.providerForm = this.fb.group({
      RatingQuestionId: [null],
      RatingQuestionTypeId: ['', Validators.required],
      Question: ['', Validators.required],
      ListRank: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      IsActive: [false],
    });

    if (this.initialData) {
      this.providerForm.patchValue({
        RatingQuestionId: this.initialData.RatingQuestionId,
        RatingQuestionTypeId: this.initialData.RatingQuestionTypeId,
        Question: this.initialData.Question,
        ListRank: this.initialData.ListRank,
        IsActive: this.initialData.IsActive,
      });
    }
  }

 private loadQuestionTypes(): void {
    this.questionTypeService.getAll().subscribe({
      next: (types) => {
        this.questionTypes = types.filter((t) => !t.IsDeleted && t.IsActive); // ✅ filter added
      },
      error: () => this.toastr.show('Failed to load question types', 'error'),
    });
  }


  onSubmit(): void {
    if (this.providerForm.invalid) {
      this.providerForm.markAllAsTouched();
      return;
    }

    const formData = this.providerForm.value;

    const payload: RatingQuestion = {
      RatingQuestionId: formData.RatingQuestionId || 0,
      RatingQuestionTypeId: +formData.RatingQuestionTypeId,
      Question: formData.Question.trim(),
      ListRank: +formData.ListRank,
      IsActive: formData.IsActive,
    };

    const request$ =
      this.isEditMode && this.initialData
        ? this.questionService.update(this.initialData.RatingQuestionId!,payload)
        : this.questionService.create(payload);

    request$.subscribe({
      next: () => {
        const msg = this.isEditMode
          ? 'Rating Question updated successfully'
          : 'Rating Question created successfully';
        this.toastr.show(msg, 'success');
        this.dataSaved.emit();
        this.close.emit();
      },
      error: (err) => {
        this.logger.logError(err, 'RatingQuestionsListPopupComponent:onSubmit');
        this.toastr.show('Failed to save Rating Question', 'error');
      },
    });
  }

  onClose(): void {
    this.providerForm.reset();
    this.close.emit();
  }
}