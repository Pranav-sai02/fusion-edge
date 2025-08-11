import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { RatingQuestionType } from '../models/rating-question-types.model';
import { RatingQuestionTypeService } from '../services/rating-question-types.service';
import {
  AddRatingQuestionType,
  LoadRatingQuestionTypes,
  SoftDeleteRatingQuestionType,
  UpdateRatingQuestionType,
} from './rating-question-types.action';

export interface RatingQuestionTypeStateModel {
  types: RatingQuestionType[];
}

@State<RatingQuestionTypeStateModel>({
  name: 'ratingQuestionTypes',
  defaults: {
    types: [],
  },
})
@Injectable()
export class RatingQuestionTypeState {
  constructor(private service: RatingQuestionTypeService) {}

  @Selector()
  static getRatingQuestionTypes(state: RatingQuestionTypeStateModel) {
    return state.types;
  }

  @Action(LoadRatingQuestionTypes)
  load(ctx: StateContext<RatingQuestionTypeStateModel>) {
    return this.service.getAll().pipe(
      tap((data) => {
        const filtered = data.filter((t) => !t.IsDeleted);
        ctx.patchState({ types: filtered });
      })
    );
  }

  @Action(AddRatingQuestionType)
  add(
    ctx: StateContext<RatingQuestionTypeStateModel>,
    { payload }: AddRatingQuestionType
  ) {
    return this.service.create(payload).pipe(
      tap((newItem) => {
        const state = ctx.getState();
        ctx.patchState({ types: [newItem, ...state.types] });
      })
    );
  }

  @Action(UpdateRatingQuestionType)
  update(
    ctx: StateContext<RatingQuestionTypeStateModel>,
    { payload }: UpdateRatingQuestionType
  ) {
    return this.service.update(payload.RatingQuestionTypeId!, payload).pipe(
      tap((updated) => {
        const state = ctx.getState();
        const updatedList = state.types.map((q) =>
          q.RatingQuestionTypeId === updated.RatingQuestionTypeId ? updated : q
        );
        ctx.patchState({ types: updatedList });
      })
    );
  }

@Action(SoftDeleteRatingQuestionType)
softdelete(
  ctx: StateContext<RatingQuestionTypeStateModel>,
  { payload }: SoftDeleteRatingQuestionType
) {
  const updatedPayload = { ...payload, IsDeleted: true };

  return this.service.softDelete(updatedPayload).pipe(
    tap(() => {
      const updatedState = ctx.getState().types.filter(
        (q) => q.RatingQuestionTypeId !== payload.RatingQuestionTypeId
      );
      ctx.patchState({ types: updatedState });
    })
  );
}


}
