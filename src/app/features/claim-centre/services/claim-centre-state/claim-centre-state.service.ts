import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClaimCentre } from '../../models/ClaimCentre';

@Injectable({
  providedIn: 'root'
})
export class ClaimCentreStateService {

   private claimCentresSubject = new BehaviorSubject<ClaimCentre[]>([]);
  claimCentres$ = this.claimCentresSubject.asObservable();

  getClaimCentres(): ClaimCentre[] {
    return this.claimCentresSubject.getValue();
  }

  setClaimCentres(centres: ClaimCentre[]): void {
    this.claimCentresSubject.next(centres);
  }

  addClaimCentre(centre: ClaimCentre): void {
    const current = this.getClaimCentres();
    this.claimCentresSubject.next([...current, centre]);
  }

  removeClaimCentre(id: number): void {
    const updated = this.getClaimCentres().filter(c => c.ClaimCentreId !== id);
    this.claimCentresSubject.next(updated);
  }

  clear(): void {
    this.claimCentresSubject.next([]);
  }
}
