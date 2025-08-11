import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../../../../constants/api-endpoints';
import { ToastrService } from '../../../../../shared/component/toastr/services/toastr.service';
import { ServiceProvider } from '../../models/ServiceProvider';

@Injectable({
  providedIn: 'root',
})
export class ServiceProvidersService {
  private apiUrl = API_ENDPOINTS.SERVICE_PROVIDERS;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  private handleError(operation = 'operation') {
    return (error: any): Observable<never> => {
      this.toastr.show(`Somthing went wrong during ${operation}.`, 'error');
      return throwError(() => error);
    };
  }

  getServiceProviders(): Observable<ServiceProvider[]> {
    return this.http
      .get<ServiceProvider[]>(this.apiUrl)
      .pipe(catchError(this.handleError('fetching all services')));
  }

  addServiceProvider(provider: ServiceProvider): Observable<ServiceProvider> {
    return this.http
      .post<ServiceProvider>(this.apiUrl, provider)
      .pipe(catchError(this.handleError(`creating serviceproviders`)));
  }

  updateServiceProvider(
    id: number,
    data: ServiceProvider
  ): Observable<ServiceProvider> {
    return this.http
      .put<ServiceProvider>(`${this.apiUrl}/${id}`, data)
      .pipe(catchError(this.handleError(`updating service provider ID ${id}`)));
  }

  deleteServiceProvider(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError(`deleting service provider ID ${id}`)));
  }

softDeleteServiceProvider(data: ServiceProvider): Observable<ServiceProvider> {
  const updatedData = { ...data, IsDeleted: true };

  return this.http
    .put<ServiceProvider>(`${this.apiUrl}/${data.ServiceProviderId}`, updatedData)
    .pipe(catchError(this.handleError(`soft deleting service provider ID ${data.ServiceProviderId}`)));
}
}
