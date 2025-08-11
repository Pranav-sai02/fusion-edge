import { RatingQuestionType } from '../models/rating-question-types.model';

export class LoadRatingQuestionTypes {
  static readonly type = '[RatingQuestionType] Load';
}

export class AddRatingQuestionType {
  static readonly type = '[RatingQuestionType] Add';
  constructor(public payload: RatingQuestionType) {}
}

export class UpdateRatingQuestionType {
  static readonly type = '[RatingQuestionType] Update';
  constructor(public payload: RatingQuestionType) {}
}

export class SoftDeleteRatingQuestionType {
  static readonly type = '[RatingQuestionType] Soft Delete';
  constructor(public payload: RatingQuestionType) {}
}
