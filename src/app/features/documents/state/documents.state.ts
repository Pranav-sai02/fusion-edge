import { State, Selector, Action, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { DocumentsService } from '../services/documents.service';
import {
  LoadDocuments,
  AddDocument,
  UpdateDocument,
  SoftDeleteDocument,
} from './documents.actions';
import { Documents } from '../models/Documents';
import { Injectable } from '@angular/core';

export interface DocumentsStateModel {
  documents: Documents[];
}

@State<DocumentsStateModel>({
  name: 'documents',
  defaults: {
    documents: [],
  },
})
@Injectable()
export class DocumentsState {
  constructor(private service: DocumentsService) {}

  @Selector()
  static getDocuments(state: DocumentsStateModel) {
    return state.documents;
  }

  @Action(LoadDocuments)
  load(ctx: StateContext<DocumentsStateModel>) {
    return this.service.getAll().pipe(
      tap((data) => {
        const filtered = data.filter((d) => !d.IsDelete);
        ctx.patchState({ documents: filtered });
      })
    );
  }

  @Action(AddDocument)
  add(ctx: StateContext<DocumentsStateModel>, { payload }: AddDocument) {
    return this.service.create(payload).pipe(
      tap((created) => {
        const state = ctx.getState();
        ctx.patchState({ documents: [created, ...state.documents] });
      })
    );
  }

  @Action(UpdateDocument)
  update(ctx: StateContext<DocumentsStateModel>, { payload }: UpdateDocument) {
    return this.service.update(payload.DocumentId!, payload).pipe(
      tap((updated) => {
        const state = ctx.getState();
        const updatedDocs = state.documents.map((doc) =>
          doc.DocumentId === updated.DocumentId ? updated : doc
        );
        ctx.patchState({ documents: updatedDocs });
      })
    );
  }
  @Action(SoftDeleteDocument)
  softDelete(
    ctx: StateContext<DocumentsStateModel>,
    { payload }: SoftDeleteDocument
  ) {
    const id = payload.DocumentId!;

    return this.service
      .update(id, {
        ...payload,
        IsDelete: true,
      })
      .pipe(
        tap(() => {
          const state = ctx.getState();
          const filtered = state.documents.filter(
            (doc) => doc.DocumentId !== id
          );
          ctx.patchState({ documents: filtered });
        })
      );
  }
}
