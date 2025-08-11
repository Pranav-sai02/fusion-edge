import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { RatingQuestionOption } from '../models/RatingQuestionOption';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class RatingQuestionOptionService {

   private apiUrl = API_ENDPOINTS.CONFIG_RATING_QUESTIONS_OPTIONS;
  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) {}

  /** GET all rating question options */
  getRatingQuestionOptions(): Observable<RatingQuestionOption[]> {
    return this.http.get<RatingQuestionOption[]>(this.apiUrl).pipe(
      catchError(error => this.handleError(error, 'getRatingQuestionOptions'))
    );
  }

  /** POST add new rating question option */
  createRatingQuestionOption(option: RatingQuestionOption): Observable<RatingQuestionOption> {
    return this.http.post<RatingQuestionOption>(this.apiUrl, option).pipe(
      catchError(error => this.handleError(error, 'addRatingQuestionOption'))
    );
  }

  /** PUT update existing rating question option */
  updateRatingQuestionOption(option: RatingQuestionOption): Observable<RatingQuestionOption> {
    return this.http.put<RatingQuestionOption>(`${this.apiUrl}/${option.RatingQuestionOptionId}`, option).pipe(
      catchError(error => this.handleError(error, 'updateRatingQuestionOption'))
    );
  }

  /** DELETE permanently delete rating question option */
  deleteRatingQuestionOption(id: number): Observable<RatingQuestionOption> {
    return this.http.delete<RatingQuestionOption>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => this.handleError(error, 'deleteRatingQuestionOption'))
    );
  }

  /** PATCH soft delete (logical delete) */
  softDeleteRatingQuestionOption(id: number): Observable<RatingQuestionOption> {
    return this.http.patch<RatingQuestionOption>(`${this.apiUrl}/${id}`, { IsDeleted: true }).pipe(
      catchError(error => this.handleError(error, 'softDeleteRatingQuestionOption'))
    );
  }

  /** Centralized error handler */
  private handleError(error: any, methodName: string): Observable<never> {
    this.logger.logError(error, `RatingQuestionOptionService.${methodName}`);
    return throwError(() => error);
  }
}

