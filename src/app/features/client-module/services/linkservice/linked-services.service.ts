// shared/services/linked-services.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ServicesPage } from '../../../service-provider/services-page/models/Services-page';

@Injectable({
  providedIn: 'root',
})
export class LinkedServicesService {
  private linkedServicesSubject = new BehaviorSubject<ServicesPage[]>([]);
  linkedServices$ = this.linkedServicesSubject.asObservable();

  get currentServices(): ServicesPage[] {
    return this.linkedServicesSubject.getValue();
  }

  addService(service: ServicesPage): void {
    const current = this.linkedServicesSubject.getValue();
    if (!current.some((s) => s.ServiceId === service.ServiceId)) {
      this.linkedServicesSubject.next([...current, service]);
    }
  }

  removeService(serviceId: number): void {
    const updated = this.linkedServicesSubject
      .getValue()
      .filter((s) => s.ServiceId !== serviceId);
    this.linkedServicesSubject.next(updated);
  }

  reset(): void {
    this.linkedServicesSubject.next([]);
  }
}
