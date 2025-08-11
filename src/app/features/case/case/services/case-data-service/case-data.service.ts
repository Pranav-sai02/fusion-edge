import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CaseDetails } from '../../models/CaseDetails';

@Injectable({
  providedIn: 'root',
})
export class CaseDataService {
  private selectedCaseSubject = new BehaviorSubject<CaseDetails | null>(null);
  selectedCase$ = this.selectedCaseSubject.asObservable();

  setSelectedCase(call: CaseDetails) {
    this.selectedCaseSubject.next(call);
  }

  clearSelectedCase() {
    this.selectedCaseSubject.next(null);
  }

  getSelectedCase(): CaseDetails | null {
    return this.selectedCaseSubject.value;
  }
}
