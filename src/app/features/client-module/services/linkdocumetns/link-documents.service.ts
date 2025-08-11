// src/app/shared/services/linked-documents.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Documents } from '../../../documents/models/Documents';


@Injectable({
  providedIn: 'root',
})
export class LinkedDocumentsService {
  private linkedDocumentsSubject = new BehaviorSubject<Documents[]>([]);
  linkedDocuments$ = this.linkedDocumentsSubject.asObservable();

  get currentDocuments(): Documents[] {
    return this.linkedDocumentsSubject.getValue();
  }

  addDocument(doc: Documents): void {
    const current = this.linkedDocumentsSubject.getValue();
    this.linkedDocumentsSubject.next([...current, doc]);
  }

  removeDocument(docId: any): void {
    const updated = this.linkedDocumentsSubject
      .getValue()
      .filter((d) => d.DocumentId !== docId);
    this.linkedDocumentsSubject.next(updated);
  }

  reset(): void {
    this.linkedDocumentsSubject.next([]);
  }
}
