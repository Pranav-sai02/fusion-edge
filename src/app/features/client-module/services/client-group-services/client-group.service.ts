import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../../../constants/api-endpoints';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { catchError, Observable, throwError } from 'rxjs';
import { ClientGroup } from '../../models/ClientGroup';

@Injectable({
  providedIn: 'root',
})
export class ClientGroupService {
  private apiUrl = API_ENDPOINTS.CLIENT_GROUP;

  constructor(private http: HttpClient, private logger: LoggerService) {}

  /** GET all client groups */
  getClientGroups(): Observable<ClientGroup[]> {
    return this.http
      .get<ClientGroup[]>(this.apiUrl)
      .pipe(catchError((error) => this.handleError(error, 'getClientGroups')));
  }

  /** POST add new client group */
  addClientGroup(clientGroup: ClientGroup): Observable<ClientGroup> {
    return this.http
      .post<ClientGroup>(this.apiUrl, clientGroup)
      .pipe(catchError((error) => this.handleError(error, 'addClientGroup')));
  }

  /** PUT update existing client group */
  updateClientGroup(clientGroup: ClientGroup): Observable<ClientGroup> {
    return this.http
      .put<ClientGroup>(
        `${this.apiUrl}/${clientGroup.ClientGroupId}`,
        clientGroup
      )
      .pipe(
        catchError((error) => this.handleError(error, 'updateClientGroup'))
      );
  }

  /** DELETE permanently delete client group */
  deleteClientGroup(id: number): Observable<ClientGroup> {
    return this.http
      .delete<ClientGroup>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((error) => this.handleError(error, 'deleteClientGroup'))
      );
  }

  /** PATCH soft delete (logical delete) */
  softDeleteClientGroup(id: number): Observable<ClientGroup> {
    return this.http
      .patch<ClientGroup>(`${this.apiUrl}/${id}`, { IsDeleted: true })
      .pipe(
        catchError((error) => this.handleError(error, 'softDeleteClientGroup'))
      );
  }

  /** Centralized error handler */
  private handleError(error: any, methodName: string): Observable<never> {
    this.logger.logError(error, `ClientGroupService.${methodName}`);
    return throwError(() => error); // Global handler or interceptor will handle UI
  }
}
