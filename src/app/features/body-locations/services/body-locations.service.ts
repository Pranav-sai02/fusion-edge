// services/body-locations.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { BodyLocations } from '../models/BodyLocations';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class BodyLocationsService {
  private apiUrl = API_ENDPOINTS.CONFIG_BODY_LOCATIONS;

  constructor(private http: HttpClient, private logger: LoggerService) {}

  private handleError(error: any, method: string) {
    this.logger.logError(error, `BodyLocationsService.${method}`);
    return throwError(() => error);
  }

  getBodyLocations(): Observable<BodyLocations[]> {
    return this.http
      .get<BodyLocations[]>(this.apiUrl)
      .pipe(catchError((error) => this.handleError(error, 'getBodyLocations')));
  }

  addBodyLocation(payload: BodyLocations): Observable<BodyLocations> {
  return this.http.post<BodyLocations>(this.apiUrl, payload).pipe(
    catchError((error) => this.handleError(error, 'addBodyLocation'))
  );
}


  updateBodyLocation(
    code: number,
    payload: Partial<BodyLocations>
  ): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/${code}`, payload)
      .pipe(
        catchError((error) => this.handleError(error, 'updateBodyLocation'))
      );
  }

// body-locations.service.ts
softDeleteBodyLocation(payload: BodyLocations): Observable<any> {
  const url = `${this.apiUrl}/${payload.BodyLocationId}`;
  return this.http.put(url, { ...payload, IsDelete: true }).pipe(
    catchError((error) => this.handleError(error, 'softDeleteBodyLocation'))
  );
}


}
