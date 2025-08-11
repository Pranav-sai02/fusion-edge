import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TransportOperator } from '../models/TransportOperator';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransportOperatorService {
  private apiUrl = 'http://localhost:3000/transportOperators';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TransportOperator[]> {
    return this.http.get<TransportOperator[]>(this.apiUrl);
  }

  update(id: number, data: Partial<TransportOperator>): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/${id}`, data)
      .pipe(catchError((err) => throwError(() => err)));
  }

  softDelete(id: number): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/${id}`, { isDeleted: true })
      .pipe(catchError((err) => throwError(() => err)));
  }
}
