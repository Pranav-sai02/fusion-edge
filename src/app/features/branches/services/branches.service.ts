import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Branches } from '../models/Branches';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class BranchesService {
  private apiUrl = API_ENDPOINTS.CONFIG_BRANCHES;

  constructor(private http: HttpClient, private logger: LoggerService) {}

  private handleError(error: any, method: string) {
    this.logger.logError(error, `BranchesService.${method}`);
    return throwError(() => error);
  }

  /** GET all branches */
  getBranches(): Observable<Branches[]> {
    return this.http.get<Branches[]>(this.apiUrl).pipe(
      catchError((error) => this.handleError(error, 'getBranches'))
    );
  }

  /** POST create branch */
  createBranch(data: Branches): Observable<Branches> {
    return this.http.post<Branches>(this.apiUrl, data).pipe(
      catchError((error) => this.handleError(error, 'createBranch'))
    );
  }

  /** PUT update branch */
  updateBranch(branchId: number, data: Partial<Branches>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${branchId}`, data).pipe(
      catchError((error) => this.handleError(error, 'updateBranch'))
    );
  }

  /** PATCH soft delete */
  softDeleteBranch(branchId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${branchId}`, { IsDelete: true }).pipe(
      catchError((error) => this.handleError(error, 'softDeleteBranch'))
    );
  }
}
