import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sidebar } from '../models/Sidebar';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private apiUrl = API_ENDPOINTS.SIDE_BAR_SERVICE;

  constructor(private http: HttpClient) {}

  getMenuItems(): Observable<Sidebar[]> {
    return this.http.get<Sidebar[]>(this.apiUrl);
  }
}
