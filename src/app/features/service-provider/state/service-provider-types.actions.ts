import { ServiceProviderTypes } from "../service-provider-types/models/ServiceProviderTypes";

export class LoadServiceProviderTypes {
  static readonly type = '[ServiceProviderTypes] Load';
}

export class AddServiceProviderTypeLocally {
  static readonly type = '[ServiceProviderTypes] Add Locally';
  constructor(public payload: ServiceProviderTypes) {}
}

export class UpdateServiceProviderType {
  static readonly type = '[ServiceProviderTypes] Update';
  constructor(public id: number, public payload: ServiceProviderTypes) {}
}

export class SoftDeleteServiceProviderType {
  static readonly type = '[ServiceProviderTypes] Soft Delete';
  constructor(public payload: ServiceProviderTypes) {}
}