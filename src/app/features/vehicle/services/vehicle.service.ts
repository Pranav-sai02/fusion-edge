import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Vehicle } from '../models/Vehicle';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private apiUrl = API_ENDPOINTS.CONFIG_VEHICLE;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl);
  }

  update(id: number, data: Partial<Vehicle>): Observable<Vehicle> {
    return this.http
      .put<Vehicle>(`${this.apiUrl}/${id}`, data)
      .pipe(catchError((err) => throwError(() => err)));
  }

  softDelete(id: number): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/${id}`, { isDeleted: true })
      .pipe(catchError((err) => throwError(() => err)));
  }
}
