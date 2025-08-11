import { Branches } from "../models/Branches";

/** Loads all active branches (excludes soft-deleted ones) */
export class LoadBranches {
  static readonly type = '[Branch] Load All';
}

/** Adds a temporary row locally to the grid (unsaved row with BranchId = 0) */
export class AddTemporaryBranchRow {
  static readonly type = '[Branch] Add Temporary Row';
  constructor(public payload: Partial<Branches>) {}
}

/** Sends POST request to backend to create a new branch */
export class CreateBranch {
  static readonly type = '[Branch] Create';
  constructor(public payload: Branches) {}
}

/** Sends PUT request to update existing branch */
export class UpdateBranch {
  static readonly type = '[Branch] Update';
  constructor(public id: number, public payload: Partial<Branches>) {}
}

/** Soft-deletes a branch by setting IsDelete = true */
export class SoftDeleteBranch {
  static readonly type = '[Branch] Soft Delete';
  constructor(public payload: Branches) {}
}
