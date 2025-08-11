import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServicesPage } from '../../models/Services-page';
import { catchError, Observable, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../../../../constants/api-endpoints';
import { LoggerService } from '../../../../../core/services/logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class ServicesPageService {
  private readonly baseUrl = API_ENDPOINTS.SERVICES_PAGE;

  constructor(private http: HttpClient, private logger: LoggerService) {}

  /** GET all */
   getAllServices(): Observable<ServicesPage[]> {
    return this.http.get<ServicesPage[]>(this.baseUrl).pipe(
      catchError(error => this.handleError(error, 'getAllServices'))
    );
  }

  /** GET single */
    getServiceById(id: number): Observable<ServicesPage> {
    return this.http.get<ServicesPage>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => this.handleError(error, 'getServiceById'))
    );
  }

  /** POST create */
    createService(payload: ServicesPage): Observable<ServicesPage> {
    return this.http.post<ServicesPage>(this.baseUrl, payload).pipe(
      catchError(error => this.handleError(error, 'createService'))
    );
  }

  /** PUT update (JSON Server supports PUT for full update) */
    updateService(serviceId: number, payload: ServicesPage): Observable<ServicesPage> {
    return this.http.put<ServicesPage>(`${this.baseUrl}/${serviceId}`, payload).pipe(
      catchError(error => this.handleError(error, 'updateService'))
    );
  }
  /** DELETE */
   deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => this.handleError(error, 'deleteService'))
    );
  }

    /** PATCH soft delete */
  softDeleteService(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, { IsDeleted: true }).pipe(
      catchError(error => this.handleError(error, 'softDeleteService'))
    );
  }

   /** Centralized error handler for service */
  private handleError(error: any, context: string): Observable<never> {
    this.logger.logError(error, `ServicesPageService.${context}`);
    return throwError(() => error);
  }
}
