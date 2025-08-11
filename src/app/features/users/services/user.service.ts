import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';
import { LoggerService } from '../../../core/services/logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = API_ENDPOINTS.USERS;

  constructor(private http: HttpClient, private logger: LoggerService) {}

  getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.apiUrl)
      .pipe(catchError((error) => this.handleError(error, 'getAllUsers')));
  }

  //  updateUser(user: User): Observable<User> {
  //   return this.http
  //     .put<User>(`${this.apiUrl}/${user.UserName}`, user)
  //     .pipe(catchError((error) => this.handleError(error, 'updateUser')));
  // }

  updateUser(userName: string, user: User): Observable<User> {
    return this.http
      .put<User>(`${this.apiUrl}/${userName}`, user)
      .pipe(catchError((error) => this.handleError(error, 'updateUser')));
  }

  createUser(user: User): Observable<User> {
    return this.http
      .post<User>(this.apiUrl, user)
      .pipe(catchError((error) => this.handleError(error, 'createUser')));
  }

  private handleError(error: any, context: string): Observable<never> {
    this.logger.logError(error, `UserService.${context}`);
    return throwError(() => error);
  }

  softDelete(user: User): Observable<User> {
    const payload = {
      ...user,
      IsDeleted: true,
    };

    return this.http
      .put<User>(`${this.apiUrl}/${user.UserName}`, payload)
      .pipe(catchError((error) => this.handleError(error, 'softDelete')));
  }
}
