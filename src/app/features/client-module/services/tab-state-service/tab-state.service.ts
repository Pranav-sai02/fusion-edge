import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import {
  Client,
  ClientDocument,
  ClientClaimCentre,
  ClientClaimController,
  ClientService,
  ClientServiceProvider,
  ClientRatingQuestion,
} from '../../models/Client';
import { Tab } from '../../models/Tab.enum';

@Injectable({ providedIn: 'root' })
export class TabStateService {
  private _selectedTab$ = new BehaviorSubject<Tab>(Tab.Details);
  readonly selectedTab$ = this._selectedTab$.asObservable();

  /** ---------------------
   * Behavioral Tabs (1–6)
   * --------------------- */
  private _services$ = new BehaviorSubject<ClientService[]>([]);
  private _ratingQs$ = new BehaviorSubject<ClientRatingQuestion[]>([]);
  private _documents$ = new BehaviorSubject<ClientDocument[]>([]);
  private _claimCentre$ = new BehaviorSubject<ClientClaimCentre[]>([]);
  private _serviceProv$ = new BehaviorSubject<ClientServiceProvider[]>([]);
  private _claimController$ = new BehaviorSubject<ClientClaimController[]>([]);

  /** ---------------------
   * Accordion Data (7th Tab)
   * --------------------- */
  private _companyInfo$ = new BehaviorSubject<Partial<Client>>({});
  private _claimInfo$ = new BehaviorSubject<Partial<Client>>({});
  private _clientData$ = new BehaviorSubject<Partial<Client>>({});
  private _customLabels$ = new BehaviorSubject<Partial<Client>>({});

  /* ---------------------
   * Tab Selection
   * --------------------- */
  setSelectedTab(tab: Tab): void {
    this._selectedTab$.next(tab);
  }

  /** ---------------------
   * GETTERS for Observables
   * --------------------- */
  getServices(): Observable<ClientService[]> {
    return this._services$.asObservable();
  }
  getRatingQuestions(): Observable<ClientRatingQuestion[]> {
    return this._ratingQs$.asObservable();
  }
  getDocuments(): Observable<ClientDocument[]> {
    return this._documents$.asObservable();
  }
  getClaimCentre(): Observable<ClientClaimCentre[]> {
    return this._claimCentre$.asObservable();
  }
  getServiceProvider(): Observable<ClientServiceProvider[]> {
    return this._serviceProv$.asObservable();
  }
  getClaimController(): Observable<ClientClaimController[]> {
    return this._claimController$.asObservable();
  }

  // Getters for Accordion Data
  getCompanyInfo(): Observable<Partial<Client>> {
    return this._companyInfo$.asObservable();
  }
  getClaimInfo(): Observable<Partial<Client>> {
    return this._claimInfo$.asObservable();
  }
  getClientData(): Observable<Partial<Client>> {
    return this._clientData$.asObservable();
  }
  getCustomLabels(): Observable<Partial<Client>> {
    return this._customLabels$.asObservable();
  }

  /** ---------------------
   * Updaters (Accordions)
   * --------------------- */
  updateCompanyInfo(info: Partial<Client>): void {
    this._companyInfo$.next({ ...this._companyInfo$.value, ...info });
  }
  updateClaimInfo(info: Partial<Client>): void {
    this._claimInfo$.next({ ...this._claimInfo$.value, ...info });
  }
  updateClientData(info: Partial<Client>): void {
    this._clientData$.next({ ...this._clientData$.value, ...info });
  }
  updateCustomLabels(info: Partial<Client>): void {
    this._customLabels$.next({ ...this._customLabels$.value, ...info });
  }

  /** ---------------------
   * Updaters (Behavioral Tabs)
   * --------------------- */
  updateServices(services: ClientService[]): void {
    this._services$.next(this.sanitizeServices(services));
  }

  updateRatingQuestions(ratingQs: ClientRatingQuestion[]): void {
    this._ratingQs$.next(this.sanitizeRatingQuestions(ratingQs));
  }

  updateDocuments(docs: ClientDocument[]): void {
    console.log('Before sanitize docs:', docs);
    this._documents$.next(this.sanitizeDocuments(docs));
    console.log('After sanitize docs:', this._documents$.value);
  }

  updateClaimCentre(centres: ClientClaimCentre[]): void {
    this._claimCentre$.next([...centres]);
  }

  updateServiceProvider(providers: ClientServiceProvider[]): void {
    this._serviceProv$.next(this.sanitizeServiceProviders(providers));
  }

  updateClaimController(controllers: ClientClaimController[]): void {
    this._claimController$.next([...controllers]);
  }

  /** ---------------------
   * Sanitize Methods
   * --------------------- */
  private sanitizeServices(services: ClientService[]): ClientService[] {
    return services.map(({ ServiceDto, ...rest }) => ({ ...rest }));
  }

  private sanitizeRatingQuestions(
    ratingQs: ClientRatingQuestion[]
  ): ClientRatingQuestion[] {
    return ratingQs.map(({ RatingQuestion, ...rest }) => ({ ...rest }));
  }

  private sanitizeDocuments(docs: ClientDocument[]): ClientDocument[] {
    return docs.map(({ Document, ...rest }) => ({ ...rest }));
  }

  private sanitizeServiceProviders(
    providers: ClientServiceProvider[]
  ): ClientServiceProvider[] {
    return providers.map(({ ClientServiceProviderDto, ...rest }) => ({
      ...rest,
    }));
  }

  /** ---------------------
   * Merge all state slices into a single Client
   * --------------------- */
  gatherFullClient(): Observable<Client> {
    return forkJoin({
      company: this._companyInfo$.pipe(take(1)),
      claim: this._claimInfo$.pipe(take(1)),
      clientData: this._clientData$.pipe(take(1)),
      customLabels: this._customLabels$.pipe(take(1)),
      services: this._services$.pipe(take(1)),
      ratingQs: this._ratingQs$.pipe(take(1)),
      documents: this._documents$.pipe(take(1)),
      claimCentre: this._claimCentre$.pipe(take(1)),
      serviceProv: this._serviceProv$.pipe(take(1)),
      claimController: this._claimController$.pipe(take(1)),
    }).pipe(
      map(
        ({
          company,
          claim,
          clientData,
          customLabels,
          services,
          ratingQs,
          documents,
          claimCentre,
          serviceProv,
          claimController,
        }) => {
          const details = this.applyDefaults({
            ...company,
            ...claim,
            ...clientData,
            ...customLabels,
          });
          return {
            ...details,
            ClientService: services,
            ClientRatingQuestion: ratingQs,
            clientDocument: documents,
            ClientClaimCentre: claimCentre,
            ClientServiceProvider: serviceProv,
            ClientClaimController: claimController,
          } as Client;
        }
      )
    );
  }

  /** ---------------------
   * Default fallback
   * --------------------- */
  private applyDefaults(details: Partial<Client>): Partial<Client> {
    return {
      ClientId: details.ClientId ?? 0,
      ClientName: details.ClientName ?? '',
      PrintName: details.PrintName ?? '',
      ClientGroupId: details.ClientGroupId ?? 0,
      ClientGroup: details.ClientGroup ?? {
        ClientGroupId: 0,
        Name: '',
        IsActive: true,
      },
      Tel: details.Tel ?? '',
      Mobile: details.Mobile ?? '',
      IsActive: details.IsActive ?? true,
      ...details,
    };
  }

  /** ---------------------
   * Debugging Helper
   * --------------------- */
  logCurrentState(): void {
    console.log('Company Info:', this._companyInfo$.value);
    console.log('Claim Info:', this._claimInfo$.value);
    console.log('Client Data:', this._clientData$.value);
    console.log('Custom Labels:', this._customLabels$.value);
    console.log('Services:', this._services$.value);
    console.log('RatingQs:', this._ratingQs$.value);
    console.log('Documents:', this._documents$.value);
    console.log('ClaimCentre:', this._claimCentre$.value);
    console.log('ServiceProvider:', this._serviceProv$.value);
    console.log('ClaimController:', this._claimController$.value);
  }

  /** ---------------------
   * Reset All Data
   * --------------------- */
  resetAll(): void {
    this._services$.next([]);
    this._ratingQs$.next([]);
    this._documents$.next([]);
    this._claimCentre$.next([]);
    this._serviceProv$.next([]);
    this._claimController$.next([]);
    this._companyInfo$.next({});
    this._claimInfo$.next({});
    this._clientData$.next({});
    this._customLabels$.next({});
    console.log('TabStateService reset complete.');
  }
}
