
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Documents } from '../models/Documents';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  private readonly apiUrl = API_ENDPOINTS.CONFIG_DOCUMENTS;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Documents[]> {
    return this.http.get<Documents[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  create(data: Documents): Observable<Documents> {
    return this.http.post<Documents>(this.apiUrl, data).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, data: Partial<Documents>): Observable<Documents> {
    return this.http.put<Documents>(`${this.apiUrl}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  softDelete(id: number): Observable<Documents> {
    return this.http.patch<Documents>(`${this.apiUrl}/${id}`, { IsDelete: true }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
