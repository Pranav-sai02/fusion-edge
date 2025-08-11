import { Documents } from "../models/Documents";


export class LoadDocuments {
  static readonly type = '[Documents] Load';
}

export class AddDocument {
  static readonly type = '[Documents] Add';
  constructor(public payload: Documents) {}
}

export class UpdateDocument {
  static readonly type = '[Documents] Update';
  constructor(public payload: Documents) {}
}

export class SoftDeleteDocument {
  static readonly type = '[Documents] Soft Delete';
  constructor(public payload: Documents) {}
}
