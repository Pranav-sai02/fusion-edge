
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { ServiceProviderTypes } from "../service-provider-types/models/ServiceProviderTypes";
import { Injectable } from "@angular/core";
import { ServiceProviderTypesService } from "../service-provider-types/services/serviceProvider-types/service-provider-types.service";

import { tap } from "rxjs";
import { AddServiceProviderTypeLocally, LoadServiceProviderTypes, SoftDeleteServiceProviderType, UpdateServiceProviderType } from "./service-provider-types.actions";


export interface ServiceProviderTypesStateModel {
  serviceProviderTypes: ServiceProviderTypes[];
}

@State<ServiceProviderTypesStateModel>({
  name: 'serviceProviderTypes',
  defaults: {
    serviceProviderTypes: [],
  },
})
@Injectable()
export class ServiceProviderTypesState {
  constructor(private service: ServiceProviderTypesService) {}

  @Selector()
  static getAll(state: ServiceProviderTypesStateModel) {
    return state.serviceProviderTypes;
  }

  @Action(LoadServiceProviderTypes)
  load(ctx: StateContext<ServiceProviderTypesStateModel>) {
    return this.service.getAll().pipe(
      tap((data) => {
        const sorted = [...data].sort(
          (a, b) => (b.ServiceProviderTypeId ?? 0) - (a.ServiceProviderTypeId ?? 0)
        );
        ctx.patchState({ serviceProviderTypes: sorted });
      })
    );
  }

  @Action(AddServiceProviderTypeLocally)
  addLocal(ctx: StateContext<ServiceProviderTypesStateModel>, { payload }: AddServiceProviderTypeLocally) {
    const state = ctx.getState();
    ctx.patchState({
      serviceProviderTypes: [payload, ...state.serviceProviderTypes],
    });
  }

 @Action(UpdateServiceProviderType)
  update(ctx: StateContext<ServiceProviderTypesStateModel>, { id, payload }: UpdateServiceProviderType) {
    const state = ctx.getState();

    const updated = state.serviceProviderTypes.map((item) =>
      item.ServiceProviderTypeId === payload.ServiceProviderTypeId ? payload : item
    );
    ctx.patchState({ serviceProviderTypes: updated });

    const { isEdited, ...sanitized } = payload;
    return this.service.update(id, sanitized);
  }

  @Action(SoftDeleteServiceProviderType)
  softDelete(ctx: StateContext<ServiceProviderTypesStateModel>, { payload }: SoftDeleteServiceProviderType) {
    const updated = ctx.getState().serviceProviderTypes.filter(
      (item) => item.ServiceProviderTypeId !== payload.ServiceProviderTypeId
    );
    ctx.patchState({ serviceProviderTypes: updated });
    return this.service.softDeleteServiceProviderType(payload);
  }
}
