import { State, Action, Selector, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Branches } from '../models/Branches';

import {
  LoadBranches,
  CreateBranch,
  UpdateBranch,
  SoftDeleteBranch,
  AddTemporaryBranchRow,
} from './branch.actions';

import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { BranchesService } from '../services/branches.service';

export interface BranchesStateModel {
  branches: Branches[];
}

@State<BranchesStateModel>({
  name: 'branches',
  defaults: {
    branches: [],
  },
})
@Injectable()
export class BranchesState {
  constructor(
    private branchService: BranchesService,
    private logger: LoggerService
  ) {}

  // 📌 SELECTOR
  @Selector()
  static getBranches(state: BranchesStateModel): Branches[] {
    return state.branches;
  }

  // 📌 LOAD all active branches
  @Action(LoadBranches)
  loadBranches(ctx: StateContext<BranchesStateModel>) {
    return this.branchService.getBranches().pipe(
      tap((branches: Branches[]) => {
        ctx.patchState({
          branches: branches.filter((b) => !b.IsDelete),
        });
      }),
      catchError((err) => {
        this.logger.logError(err, 'BranchesState.loadBranches');
        return throwError(() => err);
      })
    );
  }

  // 📌 ADD temporary UI-only branch row
  @Action(AddTemporaryBranchRow)
  addTemporaryBranchRow(ctx: StateContext<BranchesStateModel>, action: AddTemporaryBranchRow) {
    const state = ctx.getState();

    // Ensure defaults for required string fields
    const newRow: Branches = {
      BranchId: 0,
      Name: action.payload.Name ?? '',
      Province: action.payload.Province ?? '',
      Country: action.payload.Country ?? '',
      IsActive: true,
      IsDelete: false,
    };

    ctx.patchState({
      branches: [newRow, ...state.branches],
    });
  }

  // 📌 CREATE branch via POST
@Action(CreateBranch)
createBranch(ctx: StateContext<BranchesStateModel>, action: CreateBranch) {
  return this.branchService.createBranch(action.payload).pipe(
    tap((created: Branches) => {
      const state = ctx.getState();

      // Remove any temporary rows with BranchId === 0
      const branchesWithoutTemp = state.branches.filter(b => b.BranchId !== 0);

      // Add the new row
      ctx.patchState({
        branches: [created, ...branchesWithoutTemp],
      });
    }),
    catchError((err) => {
      this.logger.logError(err, 'BranchesState.createBranch');
      return throwError(() => err);
    })
  );
}


  // 📌 UPDATE existing branch via PUT
  @Action(UpdateBranch)
  updateBranch(ctx: StateContext<BranchesStateModel>, action: UpdateBranch) {
    return this.branchService.updateBranch(action.id, action.payload).pipe(
      tap(() => {
        const state = ctx.getState();
        const updated = state.branches.map((b) =>
          b.BranchId === action.id ? { ...b, ...action.payload } : b
        );
        ctx.patchState({ branches: updated });
      }),
      catchError((err) => {
        this.logger.logError(err, 'BranchesState.updateBranch');
        return throwError(() => err);
      })
    );
  }

  // 📌 SOFT DELETE via IsDelete = true
  @Action(SoftDeleteBranch)
  softDeleteBranch(ctx: StateContext<BranchesStateModel>, action: SoftDeleteBranch) {
    const branch = action.payload;

    return this.branchService.updateBranch(branch.BranchId!, {
      ...branch,
      IsDelete: true,
    }).pipe(
      tap(() => {
        const state = ctx.getState();
        const filtered = state.branches.filter(
          (b) => b.BranchId !== branch.BranchId
        );
        ctx.patchState({ branches: filtered });
      }),
      catchError((err) => {
        this.logger.logError(err, 'BranchesState.softDeleteBranch');
        return throwError(() => err);
      })
    );
  }
}