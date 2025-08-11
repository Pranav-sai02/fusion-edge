import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';

import {
  LoadVehicles,
  AddVehicleRowLocally,
  UpdateVehicle,
  SoftDeleteVehicle,
} from './vehicle.actions';

import { VehicleService } from '../services/vehicle.service';
import { tap, catchError, of } from 'rxjs';
import { Vehicle } from '../models/Vehicle';

export interface VehicleStateModel {
  vehicles: Vehicle[];
}

@State<VehicleStateModel>({
  name: 'vehicles',
  defaults: {
    vehicles: [],
  },
})
@Injectable()
export class VehicleState {
  constructor(private vehicleService: VehicleService) {}

  @Selector()
  static getVehicles(state: VehicleStateModel): Vehicle[] {
    return state.vehicles; // If needed, add `.filter(v => !v.isDeleted)` here
  }

  @Action(LoadVehicles)
  load(ctx: StateContext<VehicleStateModel>) {
    return this.vehicleService.getAll().pipe(
      tap((data) => {
        const sorted = [...data].sort(
          (a, b) => (b.RegNumber ?? 0) - (a.RegNumber ?? 0)
        );
        ctx.patchState({ vehicles: sorted });
      }),
      catchError((err) => {
        console.error('[VehicleState] Load Error', err);
        return of([]);
      })
    );
  }

  @Action(AddVehicleRowLocally)
  addLocal(ctx: StateContext<VehicleStateModel>, action: AddVehicleRowLocally) {
    const current = ctx.getState().vehicles;
    ctx.patchState({ vehicles: [action.payload, ...current] });
  }

  @Action(UpdateVehicle)
  update(ctx: StateContext<VehicleStateModel>, action: UpdateVehicle) {
    const { RegNumber, isEdited, isDeleted, ...cleanPayload } =
      action.payload;

    return this.vehicleService.update(action.id, cleanPayload).pipe(
      tap(() => {
        const updated = ctx
          .getState()
          .vehicles.map((v) =>
            v.RegNumber === action.id ? { ...action.payload } : v
          );
        ctx.patchState({ vehicles: updated });
      }),
      catchError((err) => {
        console.error('[VehicleState] Update Error', err);
        return of(null);
      })
    );
  }

  @Action(SoftDeleteVehicle)
  softDelete(ctx: StateContext<VehicleStateModel>, action: SoftDeleteVehicle) {
    const state = ctx.getState();

    // Remove the soft-deleted vehicle from the state immediately
    const updatedList = state.vehicles.filter(
      (v) => v.RegNumber !== action.payload.RegNumber
    );
    ctx.patchState({ vehicles: updatedList });

    // Call the API to soft delete
    return this.vehicleService
      .softDelete(action.payload.RegNumber!)
      .pipe(catchError(() => of(null)));
  }
}
