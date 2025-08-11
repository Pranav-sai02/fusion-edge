export interface RatingQuestionType {
  RatingQuestionTypeId: number;
  QuestionType: string;
  IncludeInRatingCalcs: boolean;
  IsActive: boolean;
  PredefinedOptions?: string[];
  IsDeleted?: boolean;
  IsEdited?: boolean; // for local UI tracking
}
