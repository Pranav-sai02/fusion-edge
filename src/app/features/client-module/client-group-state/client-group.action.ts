import { ClientGroup } from '../models/ClientGroup';

// Actions

export class LoadClientGroups {
  static readonly type = '[ClientGroup] Load';
}
export class AddClientGroup {
  static readonly type = '[ClientGroup] Add';
  constructor(public payload: ClientGroup) {}
}

export class RemoveClientGroup {
  static readonly type = '[ClientGroup] Remove';
  constructor(public payload: ClientGroup) {}
}

export class UpdateClientGroup {
  static readonly type = '[ClientGroup] Update ';
  constructor(public payload: ClientGroup) {}
}
export class SoftDeleteClientGroup {
  static readonly type = '[ClientGroup] Soft Delete';
  constructor(public payload: ClientGroup) {}
}
