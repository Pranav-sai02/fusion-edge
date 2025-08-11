import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { RatingQuestion } from '../models/rating-questions.model';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';
import { LoggerService } from '../../../core/services/logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class RatingQuestionService {
  private readonly apiUrl = API_ENDPOINTS.CONFIG_RATING_QUESTIONS;

  constructor(private http: HttpClient, private logger: LoggerService) {}

  /** 🔹 Get all rating‑questions */
  getAll(): Observable<RatingQuestion[]> {
    return this.http
      .get<RatingQuestion[]>(this.apiUrl)
      .pipe(catchError((error) => this.handleError(error, 'getAll')));
  }

  /** 🔹 Get a single rating‑question by ID */
  getById(id: number): Observable<RatingQuestion> {
    return this.http
      .get<RatingQuestion>(`${this.apiUrl}/${id}`)
      .pipe(catchError((error) => this.handleError(error, 'getById')));
  }

  /** 🔹 Create a new rating‑question */
  create(data: RatingQuestion): Observable<RatingQuestion> {
    return this.http
      .post<RatingQuestion>(this.apiUrl, data)
      .pipe(catchError((error) => this.handleError(error, 'create')));
  }

  /** 🔹 Update an existing rating‑question */
  update(
    id: number,
    data: Partial<RatingQuestion>
  ): Observable<RatingQuestion> {
    return this.http
      .put<RatingQuestion>(`${this.apiUrl}/${id}`, data)
      .pipe(catchError((error) => this.handleError(error, 'update')));
  }

  /** 🔹 Soft delete (logical delete) */
  softDelete(id: number): Observable<RatingQuestion> {
    return this.http
      .patch<RatingQuestion>(`${this.apiUrl}/${id}`, { IsDeleted: true })
      .pipe(catchError((error) => this.handleError(error, 'softDelete')));
  }

  /** 🔹 Centralized error handler */
  private handleError(
    error: HttpErrorResponse,
    methodName: string
  ): Observable<never> {
    this.logger.logError(error, `RatingQuestionService.${methodName}`);
    return throwError(() => error);
  }
}
