import { BodyLocations } from "../models/BodyLocations";


export class LoadBodyLocations {
  static readonly type = '[BodyLocations] Load';
}

export class AddBodyLocationRowLocally {
  static readonly type = '[BodyLocations] Add Row Locally';
  constructor(public payload: BodyLocations) {}
}

export class UpdateBodyLocation {
  static readonly type = '[BodyLocations] Update';
  constructor(public id: number, public payload: BodyLocations) {}
}

export class SoftDeleteBodyLocation {
  static readonly type = '[BodyLocations] Soft Delete';
  constructor(public payload: BodyLocations) {}
}
