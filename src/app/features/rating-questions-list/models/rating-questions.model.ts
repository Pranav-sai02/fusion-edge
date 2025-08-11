import { RatingQuestionType } from "../../rating-questions-types/models/rating-question-types.model";

export interface RatingQuestion {
  RatingQuestionId?: number;
  RatingQuestionTypeId: number;
  RatingQuestionType?: RatingQuestionType;
  Question: string;
  IsActive: boolean;
  ListRank: number;
  IsDeleted?: boolean;
}
