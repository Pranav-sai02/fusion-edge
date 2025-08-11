export interface RatingQuestionOption {
  RatingQuestionOptionId: number;
  RatingQuestionTypeId: number;
  QuestionOption: string;
  QualifyingPrompt: string;
  RatingValue: number;
  IsNoteRequired: boolean;
  DoRaiseFlag: boolean;
  IsActive: boolean;
  IsDeleted?: boolean;
}

