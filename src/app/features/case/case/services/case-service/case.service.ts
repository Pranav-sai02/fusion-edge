import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../../../../constants/api-endpoints';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CaseDetails } from '../../models/CaseDetails';
import { LoggerService } from '../../../../../core/services/logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  private baseUrl = API_ENDPOINTS.CASE_DEATILS;

  constructor(private http: HttpClient, private logger: LoggerService) {}

  // Get all case details
  getAllCases(): Observable<CaseDetails[]> {
    return this.http
      .get<CaseDetails[]>(this.baseUrl)
      .pipe(catchError((error) => this.handleError(error, 'getAllCases')));
  }

  // Get a single case by ID
  getCaseById(id: number): Observable<CaseDetails> {
    return this.http
      .get<CaseDetails>(`${this.baseUrl}/${id}`)
      .pipe(catchError((error) => this.handleError(error, 'getCaseById')));
  }

  // Create a new case
  createCase(caseDetail: CaseDetails): Observable<CaseDetails> {
    return this.http
      .post<CaseDetails>(this.baseUrl, caseDetail)
      .pipe(catchError((error) => this.handleError(error, 'createCase')));
  }

  // Update an existing case
  updateCase(id: number, caseDetail: CaseDetails): Observable<CaseDetails> {
    return this.http
      .put<CaseDetails>(`${this.baseUrl}/${id}`, caseDetail)
      .pipe(catchError((error) => this.handleError(error, 'updateCase')));
  }

  // Delete a case by ID
  deleteCase(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(catchError((error) => this.handleError(error, 'deleteCase')));
  }

  private handleError(error: any, methodName: string): Observable<never> {
    const context = `CaseService.${methodName}`;
    this.logger.logError(error, context);

    // Optional: Add user-friendly message or enrich the error before rethrowing
    return throwError(() => error);
  }
}
