import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RatingQuestion } from '../../models/rating-questions.model';

@Injectable({
  providedIn: 'root',
})
export class RatingQuestionsListStateService {
  private ratingQuestionsSubject = new BehaviorSubject<RatingQuestion[]>([]);
  ratingQuestions$ = this.ratingQuestionsSubject.asObservable();

  // Get current value
  getRatingQuestions(): RatingQuestion[] {
    return this.ratingQuestionsSubject.getValue();
  }

  // Update value
  setRatingQuestions(questions: RatingQuestion[]): void {
    this.ratingQuestionsSubject.next(questions);
  }

  // Add one
  addRatingQuestion(question: RatingQuestion): void {
    const current = this.getRatingQuestions();
    this.ratingQuestionsSubject.next([...current, question]);
  }

  // Remove one by ID
  removeRatingQuestion(id: number): void {
    const current = this.getRatingQuestions();
    const updated = current.filter((q) => q.RatingQuestionId !== id);
    this.ratingQuestionsSubject.next(updated);
  }

  clear(): void {
    this.ratingQuestionsSubject.next([]);
  }
}
