import { Vehicle } from '../models/Vehicle';

export class LoadVehicles {
  static readonly type = '[Vehicle] Load';
}

export class AddVehicleRowLocally {
  static readonly type = '[Vehicle] Add Row Locally';
  constructor(public payload: Vehicle) {}
}

export class UpdateVehicle {
  static readonly type = '[Vehicle] Update';
  constructor(public id: number, public payload: Vehicle) {}
}

export class SoftDeleteVehicle {
  static readonly type = '[Vehicle] Soft Delete Vehicle';
  constructor(public payload: Vehicle) {}
}
