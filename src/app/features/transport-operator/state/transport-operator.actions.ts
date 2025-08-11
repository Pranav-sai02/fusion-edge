import { TransportOperator } from '../models/TransportOperator';

export class LoadTransportOperators {
  static readonly type = '[TransportOperator] Load';
}

export class AddTransportOperatorRowLocally {
  static readonly type = '[TransportOperator] Add Row Locally';
  constructor(public payload: TransportOperator) {}
}

export class UpdateTransportOperator {
  static readonly type = '[TransportOperator] Update';
  constructor(public id: number, public payload: TransportOperator) {}
}

export class SoftDeleteTransportOperator {
  static readonly type = '[TransportOperator] Soft Delete';
  constructor(public payload: TransportOperator) {}
}
