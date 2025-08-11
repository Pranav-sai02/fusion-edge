import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ServiceProviderTypes } from '../../models/ServiceProviderTypes';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../../../../constants/api-endpoints';
import { LoggerService } from '../../../../../core/services/logger/logger.service';
import { ToastrService } from '../../../../../shared/component/toastr/services/toastr.service';

@Injectable({
  providedIn: 'root',
})
export class ServiceProviderTypesService {
  private readonly apiUrl = API_ENDPOINTS.CONFIG_SERVICE_PROVIDER_TYPES;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  private handleError(operation = 'operation') {
    return (error: any): Observable<never> => {
      console.error(`${operation} failed:`, error);
      this.toastr.show(`Something went wrong during ${operation}.`, 'error');
      return throwError(() => error);
    };
  }

  /** GET all */
  getAll(): Observable<ServiceProviderTypes[]> {
    return this.http
      .get<ServiceProviderTypes[]>(this.apiUrl)
      .pipe(catchError(this.handleError('fetching service provider types')));
  }

  /** GET single */
  getServiceProviderTypeById(id: number): Observable<ServiceProviderTypes> {
    return this.http
      .get<ServiceProviderTypes>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError('fetching service provider type ID')));
  }

  /** POST create */

  create(data: ServiceProviderTypes): Observable<ServiceProviderTypes> {
    const payload: ServiceProviderTypes = {
      ServiceProviderCode: data.ServiceProviderCode?.trim(),
      Description: data.Description?.trim(),
      IsActive: data.IsActive ?? true,
      IsDelete: false,
    };

    return this.http
      .post<ServiceProviderTypes>(this.apiUrl, payload)
      .pipe(catchError(this.handleError('creating service provider type')));
  }

  /** PUT update  */
  update(id: number, data: Partial<ServiceProviderTypes>): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/${id}`, data)
      .pipe(
        catchError(this.handleError(`updating service provider type ID ${id}`))
      );
  }

  softDeleteServiceProviderType(data: ServiceProviderTypes): Observable<void> {
    // ensure IsDelete is true
    const payload: ServiceProviderTypes = {
      ...data,
      IsDelete: true,
    };

    return this.http
      .put<void>(`${this.apiUrl}/${payload.ServiceProviderTypeId}`, payload)
      .pipe(
        catchError(this.handleError('soft deleting service provider type'))
      );
  }
}
