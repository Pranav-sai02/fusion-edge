import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, Observable } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
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
  // which tab is open
  private readonly _selectedTab$ = new BehaviorSubject<Tab>(Tab.Details);
  readonly selectedTab$ = this._selectedTab$.asObservable();

  // main tabs (arrays)
  private readonly _services$        = new BehaviorSubject<ClientService[]>([]);
  private readonly _ratingQs$        = new BehaviorSubject<ClientRatingQuestion[]>([]);
  private readonly _documents$       = new BehaviorSubject<ClientDocument[]>([]);
  private readonly _claimCentre$     = new BehaviorSubject<ClientClaimCentre[]>([]);
  private readonly _serviceProv$     = new BehaviorSubject<ClientServiceProvider[]>([]);
  private readonly _claimController$ = new BehaviorSubject<ClientClaimController[]>([]);

  // accordions (patchable chunks)
  private readonly _companyInfo$  = new BehaviorSubject<Partial<Client>>({});
  private readonly _claimInfo$    = new BehaviorSubject<Partial<Client>>({});
  private readonly _clientData$   = new BehaviorSubject<Partial<Client>>({});
  private readonly _customLabels$ = new BehaviorSubject<Partial<Client>>({});

  // selectors
  readonly services$        = this._services$.asObservable();
  readonly ratingQs$        = this._ratingQs$.asObservable();
  readonly documents$       = this._documents$.asObservable();
  readonly claimCentre$     = this._claimCentre$.asObservable();
  readonly serviceProv$     = this._serviceProv$.asObservable();
  readonly claimController$ = this._claimController$.asObservable();
  readonly companyInfo$     = this._companyInfo$.asObservable();
  readonly claimInfo$       = this._claimInfo$.asObservable();
  readonly clientData$      = this._clientData$.asObservable();
  readonly customLabels$    = this._customLabels$.asObservable();

  // live view of everything (nice for summaries)
  readonly allTabsVm$ = combineLatest([
    this.services$, this.ratingQs$, this.documents$,
    this.claimCentre$, this.serviceProv$, this.claimController$,
    this.companyInfo$, this.claimInfo$, this.clientData$, this.customLabels$,
  ]).pipe(
    map(([services, ratingQs, documents, claimCentre, serviceProv, claimController, company, claim, clientData, customLabels]) => ({
      services,
      ratingQs,
      documents,
      claimCentre,
      serviceProv,
      claimController,
      // ensure claim slice wins for preview too
      details: { ...clientData, ...company, ...customLabels, ...claim },
    })),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  // ----- helpers for documents -----
  private docKey = (d: ClientDocument) => `${d.DocumentId ?? 'new'}:${d.ClientDocumentId ?? 0}`;

  private peekDocuments(): ClientDocument[] { return this._documents$.value; }

  private dedupeDocs(docs: ClientDocument[]): ClientDocument[] {
    const map = new Map<string, ClientDocument>();
    for (const d of docs) map.set(this.docKey(d), d); // keep last occurrence
    return Array.from(map.values());
  }

  // tab change
  setSelectedTab(tab: Tab): void { this._selectedTab$.next(tab); }

  // patch accordions (merge)
  patchCompanyInfo(info: Partial<Client>): void { this._companyInfo$.next({ ...this._companyInfo$.value, ...info }); }
  patchClaimInfo(info: Partial<Client>): void   { this._claimInfo$.next({ ...this._claimInfo$.value, ...info }); }
  patchClientData(info: Partial<Client>): void  { this._clientData$.next({ ...this._clientData$.value, ...info }); }
  patchCustomLabels(info: Partial<Client>): void{ this._customLabels$.next({ ...this._customLabels$.value, ...info }); }

  // replace slices (usually after API load)
  setServices(v: ClientService[]): void                 { this._services$.next(this.sanitizeServices(v)); }
  setRatingQuestions(v: ClientRatingQuestion[]): void   { this._ratingQs$.next(this.sanitizeRatingQuestions(v)); }
  setDocuments(v: ClientDocument[]): void               {
    const sanitized = this.sanitizeDocuments(v);
    this._documents$.next(this.dedupeDocs(sanitized));
  }
  setClaimCentres(v: ClientClaimCentre[]): void         { this._claimCentre$.next([...v]); }
  setClaimCentre(v: ClientClaimCentre[]): void          { this.setClaimCentres(v); } // alias
  setServiceProviders(v: ClientServiceProvider[]): void { this._serviceProv$.next(this.sanitizeServiceProviders(v)); }
  setClaimControllers(v: ClientClaimController[]): void { this._claimController$.next([...v]); }

  // tiny helpers for documents (link/unlink UI)
  addDocument(doc: ClientDocument): void {
    const cur = this.peekDocuments();
    const key = this.docKey(doc);

    const hasActive = cur.some(d => this.docKey(d) === key && !d.IsDeleted);
    if (hasActive) {
      this._documents$.next(this.sanitizeDocuments(cur));
      return;
    }

    const hadSoft = cur.some(d => this.docKey(d) === key && d.IsDeleted === true);
    if (hadSoft) {
      const restored = cur.map(d => this.docKey(d) === key ? { ...doc, IsDeleted: false } : d);
      this._documents$.next(this.sanitizeDocuments(restored));
      return;
    }

    this._documents$.next(
      this.sanitizeDocuments(this.dedupeDocs([...cur, { ...doc, IsDeleted: false }]))
    );
  }

  upsertDocument(doc: ClientDocument): void {
    const cur = this.peekDocuments();
    const key = this.docKey(doc);

    const idx = cur.findIndex(d => this.docKey(d) === key);
    if (idx >= 0) {
      const next = [...cur];
      next[idx] = { ...doc, IsDeleted: false };
      this._documents$.next(this.sanitizeDocuments(next));
      return;
    }

    const softIdx = cur.findIndex(d => d.DocumentId === doc.DocumentId && d.IsDeleted === true);
    if (softIdx >= 0) {
      const next = [...cur];
      next[softIdx] = { ...doc, IsDeleted: false };
      this._documents$.next(this.sanitizeDocuments(next));
      return;
    }

    this._documents$.next(
      this.sanitizeDocuments(this.dedupeDocs([...cur, { ...doc, IsDeleted: false }]))
    );
  }

  softDeleteDocument(match: (d: ClientDocument) => boolean): void {
    const next = this.peekDocuments().map(d => match(d) ? { ...d, IsDeleted: true } : d);
    this._documents$.next(next);
  }

  restoreDocument(match: (d: ClientDocument) => boolean): void {
    const next = this.peekDocuments().map(d => match(d) ? { ...d, IsDeleted: false } : d);
    this._documents$.next(next);
  }

  // build a POST/PUT-ready Client (use this, then decide POST vs PUT outside)
  gatherFullClient(): Observable<Client> {
    return forkJoin({
      company:        this._companyInfo$.pipe(take(1)),
      claim:          this._claimInfo$.pipe(take(1)),
      clientData:     this._clientData$.pipe(take(1)),
      customLabels:   this._customLabels$.pipe(take(1)),
      services:       this._services$.pipe(take(1)),
      ratingQs:       this._ratingQs$.pipe(take(1)),
      documents:      this._documents$.pipe(take(1)),
      claimCentre:    this._claimCentre$.pipe(take(1)),
      serviceProv:    this._serviceProv$.pipe(take(1)),
      claimController:this._claimController$.pipe(take(1)),
    }).pipe(
      map(({ company, claim, clientData, customLabels, services, ratingQs, documents, claimCentre, serviceProv, claimController }) => {
        // claim wins the merge
        const details = this.applyDefaults({ ...clientData, ...company, ...customLabels, ...claim });

        // keep only active docs and dedupe by key
        const activeDocs = (documents ?? []).filter(d => !d.IsDeleted);
        const dedupedDocs = this.dedupeDocs(activeDocs);

        const payload: Client = {
          ...details,
          ClientService:         services,
          ClientRatingQuestion:  ratingQs,
          clientDocument:        dedupedDocs,
          ClientClaimCentre:     claimCentre,
          ClientServiceProvider: serviceProv,
          ClientClaimController: claimController,
        } as Client;

        return payload;
      })
    );
  }

  // sanitize helpers (strip UI DTOs, normalize base64)
  private sanitizeServices(items: ClientService[]): ClientService[] {
    return (items || []).map(({ ServiceDto, ...rest }: any) => ({ ...rest }));
  }

  private sanitizeRatingQuestions(items: ClientRatingQuestion[]): ClientRatingQuestion[] {
    return (items || []).map(({ RatingQuestion, ...rest }: any) => ({ ...rest }));
  }

  private sanitizeDocuments(items: ClientDocument[]): ClientDocument[] {
    return (items || []).map((doc: any) => {
      const { Document, DocumentDto, FileData, ...rest } = doc || {};
      return {
        ...rest,
        FileData: this.toPureBase64(FileData),
      } as ClientDocument;
    });
  }

  private sanitizeServiceProviders(items: ClientServiceProvider[]): ClientServiceProvider[] {
    return (items || []).map(({ ClientServiceProviderDto, ...rest }: any) => ({ ...rest }));
  }

  private toPureBase64(x?: string | null): string {
    if (!x) return '';
    const i = x.indexOf('base64,');
    return i >= 0 ? x.substring(i + 7) : x;
  }

  // safe defaults so UI doesn’t explode
  private applyDefaults(details: Partial<Client>): Partial<Client> {
    return {
      ClientId:      details.ClientId ?? 0,
      ClientName:    details.ClientName ?? '',
      PrintName:     details.PrintName ?? '',
      ClientGroupId: details.ClientGroupId ?? 0,
      ClientGroup:   details.ClientGroup ?? { ClientGroupId: 0, Name: '', IsActive: true },
      Tel:           details.Tel ?? '',
      Mobile:        details.Mobile ?? '',
      IsActive:      details.IsActive ?? true,
      ...details,
    };
  }

  // reset everything
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
    this._selectedTab$.next(Tab.Details);
  }

  // snapshots (handy for per-tab PUT)
  get servicesSnapshot(): ClientService[]                { return this._services$.value; }
  get ratingQsSnapshot(): ClientRatingQuestion[]         { return this._ratingQs$.value; }
  get documentsSnapshot(): ClientDocument[]              { return this._documents$.value; }
  get claimCentreSnapshot(): ClientClaimCentre[]         { return this._claimCentre$.value; }
  get serviceProvSnapshot(): ClientServiceProvider[]     { return this._serviceProv$.value; }
  get claimControllerSnapshot(): ClientClaimController[] { return this._claimController$.value; }
  get companyInfoSnapshot(): Partial<Client>             { return this._companyInfo$.value; }
  get claimInfoSnapshot(): Partial<Client>               { return this._claimInfo$.value; }
  get clientDataSnapshot(): Partial<Client>              { return this._clientData$.value; }
  get customLabelsSnapshot(): Partial<Client>            { return this._customLabels$.value; }

  // set everything from API response (use after POST/PUT)
  setFromServer(c: Client): void {
    this.setServices(c.ClientService ?? []);
    this.setRatingQuestions(c.ClientRatingQuestion ?? []);
    this.setDocuments((c as any).ClientDocument ?? (c as any).clientDocument ?? []);
    this.setClaimCentres(c.ClientClaimCentre ?? []);
    this.setServiceProviders(c.ClientServiceProvider ?? []);
    this.setClaimControllers(c.ClientClaimController ?? []);
    this.patchCompanyInfo(c);
    this.patchClaimInfo(c);
    this.patchClientData(c);
    this.patchCustomLabels(c);
  }

  // backward-compat shims
  getServices()        { return this.services$; }
  getRatingQuestions() { return this.ratingQs$; }
  getServiceProvider() { return this.serviceProv$; }
  getCustomLabels()    { return this.customLabels$; }
  getClaimCentre()     { return this.claimCentre$; }
  getClaimController() { return this.claimController$; }

  updateCompanyInfo(v: Partial<Client>)             { this.patchCompanyInfo(v); }
  updateClaimInfo(v: Partial<Client>)               { this.patchClaimInfo(v); }
  updateClientData(v: Partial<Client>)              { this.patchClientData(v); }
  updateCustomLabels(v: Partial<Client>)            { this.patchCustomLabels(v); }
  updateServices(v: ClientService[])                { this.setServices(v); }
  updateRatingQuestions(v: ClientRatingQuestion[])  { this.setRatingQuestions(v); }
  updateServiceProvider(v: ClientServiceProvider[]) { this.setServiceProviders(v); }
  updateDocuments(v: ClientDocument[])              { this.setDocuments(v); }
  updateClaimCentre(v: ClientClaimCentre[])         { this.setClaimCentres(v); }
  updateClaimController(v: ClientClaimController[]) { this.setClaimControllers(v); }
}
