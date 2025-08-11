import { Injectable } from '@angular/core';
import { ServiceProvider } from '../../models/ServiceProvider';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceProvidersStateService {
  private linkedProvidersSubject = new BehaviorSubject<ServiceProvider[]>([]);
  linkedProviders$ = this.linkedProvidersSubject.asObservable();

  constructor() {}

  setLinkedProviders(providers: ServiceProvider[]): void {
    this.linkedProvidersSubject.next(providers);
  }

  getLinkedProviders(): ServiceProvider[] {
    return this.linkedProvidersSubject.getValue();
  }

  addProvider(provider: ServiceProvider): void {
    const current = this.getLinkedProviders();
    this.linkedProvidersSubject.next([...current, provider]);
  }

  removeProvider(id: number): void {
    const filtered = this.getLinkedProviders().filter(
      (p) => p.ServiceProviderId !== id
    );
    this.linkedProvidersSubject.next(filtered);
  }

  clear(): void {
    this.linkedProvidersSubject.next([]);
  }
}
