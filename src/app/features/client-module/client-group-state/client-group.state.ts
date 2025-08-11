import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ClientGroup } from '../models/ClientGroup';
import {
  AddClientGroup,
  LoadClientGroups,
  RemoveClientGroup,
  SoftDeleteClientGroup,
  UpdateClientGroup,
} from './client-group.action';
import { tap } from 'rxjs/operators';
import { ClientGroupService } from '../services/client-group-services/client-group.service';

export interface ClientGroupStateModel {
  clientGroups: ClientGroup[];
}
@State<ClientGroupStateModel>({
  name: 'clientGroups',
  defaults: {
    clientGroups: [],
  },
})
@Injectable()
export class ClientGroupState {
  constructor(private clientGroupService: ClientGroupService) {}

  @Selector()
  static getClientGroups(state: ClientGroupStateModel) {
    return state.clientGroups;
  }

  @Action(LoadClientGroups)
  loadAreaCodes(ctx: StateContext<ClientGroupStateModel>) {
    return this.clientGroupService.getClientGroups().pipe(
      tap((clientGroups) => {
        // Sort by AreaCodeId in descending order; handle undefined safely
        const sorted = [...clientGroups].sort((a, b) => {
          const idA = a.ClientGroupId ?? 0;
          const idB = b.ClientGroupId ?? 0;
          return idB - idA;
        });

        ctx.patchState({ clientGroups: sorted });
      })
    );
  }

  @Action(AddClientGroup)
  addClientGroup(
    ctx: StateContext<ClientGroupStateModel>,
    action: AddClientGroup
  ) {
    const state = ctx.getState();
    const newClientGroup = action.payload;
    ctx.patchState({
      clientGroups: [newClientGroup, ...state.clientGroups],
    });
  }

  @Action(UpdateClientGroup)
  updateClientGroup(
    ctx: StateContext<ClientGroupStateModel>,
    action: UpdateClientGroup
  ) {
    const state = ctx.getState();
    const updatedClientGroup = state.clientGroups.map((clientGroup) =>
      clientGroup.ClientGroupId === action.payload.ClientGroupId
        ? action.payload
        : clientGroup
    );
    ctx.patchState({
      clientGroups: updatedClientGroup,
    });
    return this.clientGroupService.updateClientGroup(action.payload);
  }

  @Action(RemoveClientGroup)
  removeClientGroup(
    ctx: StateContext<ClientGroupStateModel>,
    action: RemoveClientGroup
  ) {
    const id = action.payload.ClientGroupId!;
    const state = ctx.getState();
    const filteredList = state.clientGroups.filter(
      (group) => group.ClientGroupId !== id
    );
    ctx.patchState({ clientGroups: filteredList });
    return this.clientGroupService.deleteClientGroup(id);
  }

  @Action(SoftDeleteClientGroup)
  softDeleteClientGroup(
    ctx: StateContext<ClientGroupStateModel>,
    action: SoftDeleteClientGroup
  ) {
    const id = action.payload.ClientGroupId!;
    const state = ctx.getState();
    const filteredList = state.clientGroups.filter(
      (group) => group.ClientGroupId !== id
    );
    ctx.patchState({ clientGroups: filteredList });
    return this.clientGroupService.softDeleteClientGroup(id);
  }
}
