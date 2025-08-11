import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AreaCodes } from '../../models/AreaCodes';
import { catchError, Observable, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../../../constants/api-endpoints';
import { LoggerService } from '../../../../core/services/logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class AreaCodesService {
  private apiUrl = API_ENDPOINTS.AREA_CODES;

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) {}

  /** GET all area codes */
  getAreaCodes(): Observable<AreaCodes[]> {
    return this.http.get<AreaCodes[]>(this.apiUrl).pipe(
      catchError(error => this.handleError(error, 'getAreaCodes'))
    );
  }

  /** POST create area code */
  addAreaCode(areaCode: AreaCodes): Observable<AreaCodes> {
    const payload = {
      AreaCode: areaCode.AreaCode,
      Description: areaCode.Description,
      Type: areaCode.Type,
      IsActive: areaCode.IsActive,
    };
    return this.http.post<AreaCodes>(this.apiUrl, payload).pipe(
      catchError(error => this.handleError(error, 'addAreaCode'))
    );
  }

  /** PUT update area code */
  updateAreaCode(areaCodeId: number, data: Partial<AreaCodes>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${areaCodeId}`, data).pipe(
      catchError(error => this.handleError(error, 'updateAreaCode'))
    );
  }

  /** PUT soft delete */
  softDeleteAreaCode(areaCode: AreaCodes): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${areaCode.AreaCode}`, areaCode).pipe(
      catchError(error => this.handleError(error, 'softDeleteAreaCode'))
    );
  }

  /** DELETE area code */
  deleteAreaCode(code: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${code}`).pipe(
      catchError(error => this.handleError(error, 'deleteAreaCode'))
    );
  }

  /** Centralized error handler */
  private handleError(error: any, methodName: string): Observable<never> {
    this.logger.logError(error, `AreaCodesService.${methodName}`);
    return throwError(() => error);
  }
}
