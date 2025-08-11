import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  LoadBodyLocations,
  AddBodyLocationRowLocally,
  UpdateBodyLocation,
  SoftDeleteBodyLocation,
} from './body-locations.actions';

import { BodyLocationsService } from '../services/body-locations.service';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { ToastrService } from '../../../shared/component/toastr/services/toastr.service';
import { BodyLocations } from '../models/BodyLocations';

export interface BodyLocationsStateModel {
  bodyLocations: BodyLocations[];
}

@State<BodyLocationsStateModel>({
  name: 'bodylocations',
  defaults: {
    bodyLocations: [],
  },
})
@Injectable()
export class BodyLocationsState {
  constructor(
    private bodyLocationsService: BodyLocationsService,
    private toaster: ToastrService,
    private logger: LoggerService
  ) {}

  @Selector()
  static getBodyLocations(state: BodyLocationsStateModel): BodyLocations[] {
    return state.bodyLocations;
  }

  @Action(LoadBodyLocations)
  load(ctx: StateContext<BodyLocationsStateModel>) {
    return this.bodyLocationsService.getBodyLocations().pipe(
      tap((items) => {
        const sorted = [...items].sort(
          (a, b) => (b.BodyLocationId ?? 0) - (a.BodyLocationId ?? 0)
        );
        ctx.patchState({ bodyLocations: sorted });
      }),
      catchError((error) => {
        this.logger.logError(error, 'BodyLocationsState.load');
        this.toaster.show('Failed to load body locations', 'error');
        return of([]);
      })
    );
  }

  @Action(AddBodyLocationRowLocally)
  addRow(
    ctx: StateContext<BodyLocationsStateModel>,
    action: AddBodyLocationRowLocally
  ) {
    const state = ctx.getState();
    ctx.patchState({ bodyLocations: [action.payload, ...state.bodyLocations] });
  }

  @Action(UpdateBodyLocation)
  update(
    ctx: StateContext<BodyLocationsStateModel>,
    action: UpdateBodyLocation
  ) {
    const state = ctx.getState();
    const updatedList = state.bodyLocations.map((b) =>
      b.BodyLocationId === action.payload.BodyLocationId ? action.payload : b
    );
    ctx.patchState({ bodyLocations: updatedList });

    const { IsEdited, ...clean } = action.payload;

    return this.bodyLocationsService.updateBodyLocation(action.id, clean).pipe(
      catchError((error) => {
        this.logger.logError(error, 'BodyLocationsState.update');
        this.toaster.show('Failed to update', 'error');
        return of(null);
      })
    );
  }

  @Action(SoftDeleteBodyLocation)
  softDelete(
    ctx: StateContext<BodyLocationsStateModel>,
    action: SoftDeleteBodyLocation
  ) {
    const updatedPayload = { ...action.payload, IsDelete: true };

    return this.bodyLocationsService
      .softDeleteBodyLocation(updatedPayload)
      .pipe(
        tap(() => {
          const state = ctx.getState();
          const updatedList = state.bodyLocations.filter(
            (b) => b.BodyLocationId !== action.payload.BodyLocationId
          );
          ctx.patchState({ bodyLocations: updatedList });
          this.toaster.show('Deleted successfully', 'success');
        }),
        catchError((error) => {
          this.logger.logError(error, 'BodyLocationsState.softDelete');
          this.toaster.show('Failed to delete', 'error');
          return of(null);
        })
      );
  }
}
