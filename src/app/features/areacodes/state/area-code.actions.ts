import { AreaCodes } from '../models/AreaCodes';

export class LoadAreaCodes {
  static readonly type = '[AreaCodes] Load';
}

export class AddAreaCodeRowLocally {
  static readonly type = '[AreaCodes] Add Row Locally';
  constructor(public payload: AreaCodes) {}
}

export class UpdateAreaCode {
  static readonly type = '[AreaCodes] Update';
  constructor(public areaCodeId: number, public payload: AreaCodes) {}
}

export class SoftDeleteAreaCode {
  static readonly type = '[AreaCodes] Soft Delete';
  constructor(public payload: AreaCodes) {}
}
