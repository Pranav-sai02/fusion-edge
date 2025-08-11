import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { TransportOperator } from '../models/TransportOperator';
import { TransportOperatorService } from '../services/transport-operator.service';
import {
  LoadTransportOperators,
  AddTransportOperatorRowLocally,
  UpdateTransportOperator,
  SoftDeleteTransportOperator,
} from './transport-operator.actions';

export interface TransportOperatorStateModel {
  transportOperators: TransportOperator[];
}

@State<TransportOperatorStateModel>({
  name: 'transportOperators',
  defaults: {
    transportOperators: [],
  },
})
@Injectable()
export class TransportOperatorState {
  constructor(private service: TransportOperatorService) {}

  @Selector()
  static getTransportOperators(state: TransportOperatorStateModel): TransportOperator[] {
    return state.transportOperators;
  }

  @Action(LoadTransportOperators)
  load(ctx: StateContext<TransportOperatorStateModel>) {
    return this.service.getAll().pipe(
      tap((list) => {
        const sorted = [...list].sort((a, b) => (b.TransportOperatorId ?? 0) - (a.TransportOperatorId ?? 0));
        ctx.patchState({ transportOperators: sorted });
      }),
      catchError((err) => of([]))
    );
  }

  @Action(AddTransportOperatorRowLocally)
  addLocal(ctx: StateContext<TransportOperatorStateModel>, action: AddTransportOperatorRowLocally) {
    const state = ctx.getState();
    ctx.patchState({
      transportOperators: [action.payload, ...state.transportOperators],
    });
  }

  @Action(UpdateTransportOperator)
  update(ctx: StateContext<TransportOperatorStateModel>, action: UpdateTransportOperator) {
    const state = ctx.getState();
    const updatedList = state.transportOperators.map((t) =>
      t.TransportOperatorId === action.payload.TransportOperatorId ? action.payload : t
    );
    ctx.patchState({ transportOperators: updatedList });

    const { TransportOperatorId, isEdited, isDeleted, ...cleanPayload } = action.payload;
    return this.service.update(action.id, cleanPayload).pipe(
      catchError(() => of(null))
    );
  }

  @Action(SoftDeleteTransportOperator)
  softDelete(ctx: StateContext<TransportOperatorStateModel>, action: SoftDeleteTransportOperator) {
    const state = ctx.getState();
    const updatedList = state.transportOperators.filter((t) => t.TransportOperatorId !== action.payload.TransportOperatorId);
    ctx.patchState({ transportOperators: updatedList });

    return this.service.softDelete(action.payload.TransportOperatorId!).pipe(
      catchError(() => of(null))
    );
  }
}
