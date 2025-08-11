import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../../constants/api-endpoints';
import { ClaimCentre } from '../../models/ClaimCentre';


@Injectable({
  providedIn: 'root',
})
export class ClaimCentreService {
  private apiUrl = API_ENDPOINTS.CONFIG_CLAIM_CENTRES;

  constructor(private http: HttpClient) {}

  // GET all claim centres
  getClaimCentres(): Observable<ClaimCentre[]> {
    return this.http.get<ClaimCentre[]>(this.apiUrl);
  }

  // GET a specific claim centre by ID
  getClaimCentreById(id: number): Observable<ClaimCentre> {
    return this.http.get<ClaimCentre>(`${this.apiUrl}/${id}`);
  }

  // POST a new claim centre
  createClaimCentre(claimCentre: ClaimCentre): Observable<ClaimCentre> {
    return this.http.post<ClaimCentre>(this.apiUrl, claimCentre);
  }

  // PUT (update) a claim centre by ID
  updateClaimCentre(id: number, claimCentre: ClaimCentre): Observable<ClaimCentre> {
    return this.http.put<ClaimCentre>(`${this.apiUrl}/${id}`, claimCentre);
  }

  // DELETE a claim centre by ID (soft delete or actual delete depends on backend)
  deleteClaimCentre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
