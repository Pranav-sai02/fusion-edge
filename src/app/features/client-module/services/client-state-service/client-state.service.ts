import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RatingQuestion } from '../../../rating-questions-list/models/rating-questions.model';
import { ClaimCentre } from '../../../claim-centre/models/ClaimCentre';
import { ServiceProvider } from '../../../service-provider/service-providers/models/ServiceProvider';
import { Client  } from '../../models/Client';
import { ServicesPage } from '../../../service-provider/services-page/models/Services-page';
import { Documents } from '../../../documents/models/Documents';
import { User } from '../../../users/models/User';

@Injectable({
  providedIn: 'root',
})
export class ClientStateService {
  private clientDetails = new BehaviorSubject<Client[]>([]);
  private servicesSubject = new BehaviorSubject<ServicesPage[]>([]);
  private ratingQuestionsSubject = new BehaviorSubject<RatingQuestion[]>([]);
  private documentsSubject = new BehaviorSubject<Documents[]>([]);
  private claimCentreSubject = new BehaviorSubject<ClaimCentre[]>([]);
  private serviceProvidersSubject = new BehaviorSubject<ServiceProvider[]>([]);
  private claimControllerSubject = new BehaviorSubject<User[]>([]);

  // Observables

  clientDetails$ = this.clientDetails.asObservable();
  services$ = this.servicesSubject.asObservable();
  ratingQuestions$ = this.ratingQuestionsSubject.asObservable();
  documents$ = this.documentsSubject.asObservable();
  claimCentre$ = this.claimCentreSubject.asObservable();
  serviceProviders$ = this.serviceProvidersSubject.asObservable();
  claimController$ = this.claimControllerSubject.asObservable();

  // Setter methods

  setClientDetails(data: Client[]) {
    this.clientDetails.next(data);
  }

  setServices(data: ServicesPage[]) {
    this.servicesSubject.next(data);
  }
  setRatingQuestions(data: RatingQuestion[]) {
    this.ratingQuestionsSubject.next(data);
  }

  setDocuments(data: Documents[]) {
    this.documentsSubject.next(data);
  }
  setClaimCentre(data: ClaimCentre[]) {
    this.claimCentreSubject.next(data);
  }

  setServiceProviders(data: ServiceProvider[]) {
    this.serviceProvidersSubject.next(data);
  }

  setClaimController(data: User[]) {
    this.claimControllerSubject.next(data);
  }

  // Snapshot of current state
  getSnapshot() {
    return {
      clientDetails: this.clientDetails.getValue(),
      services: this.servicesSubject.getValue(),
      ratingQuestions: this.ratingQuestionsSubject.getValue(),
      documents: this.documentsSubject.getValue(),
      claimCentre: this.claimCentreSubject.getValue(),
      serviceProviders: this.serviceProvidersSubject.getValue(),
      claimController: this.claimControllerSubject.getValue(),
    };
  }
}
