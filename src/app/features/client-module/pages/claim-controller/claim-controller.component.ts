import { Component, OnInit } from '@angular/core';
import {
  GridApi,
  GridOptions,
  ColDef,
  CellClickedEvent,
  GridReadyEvent,
} from 'ag-grid-community';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { UnlinkCellRendererComponent } from '../../../../shared/component/unlink-cell-renderer/unlink-cell-renderer.component';
import { User } from '../../../users/models/User';
import { UserService } from '../../../users/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';

import { AspNetUser, ClientClaimController } from '../../models/Client';
import { TabStateService } from '../../services/tab-state-service/tab-state.service';

@Component({
  selector: 'app-claim-controller',
  standalone: false,
  templateUrl: './claim-controller.component.html',
  styleUrls: ['./claim-controller.component.css'],
})
export class ClaimControllerComponent implements OnInit {
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  UnlinkCellRendererComponent = UnlinkCellRendererComponent;

  allUsers: User[] = [];
  users: User[] = [];
  form: FormGroup;
  claimcontroller: { id: string; name: string }[] = [];
  gridApi!: GridApi;

  columnDefs: ColDef<User>[] = [
    {
      field: 'Firstname',
      headerName: 'First Name',
      minWidth: 200,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'Lastname',
      headerName: 'Last Name',
      minWidth: 200,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'UserEmail',
      headerName: 'Email',
      minWidth: 200,
      flex: 1,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'PhoneNumber',
      headerName: 'Phone Number',
      minWidth: 200,
      flex: 1,
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
    {
      suppressHeaderMenuButton: true,
      pinned: 'right',
      maxWidth: 100,
      cellRenderer: 'unlinkCellRenderer',
      cellRendererParams: {
        onUnlink: (data: User) => this.unlinkController(data),
      },
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
  };

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private tabStateService: TabStateService
  ) {
    this.form = this.fb.group({
      selectedClamController: [null],
    });
  }

  ngOnInit(): void {
    this.loadUsers().then(() => {
      this.tabStateService.getClaimController().subscribe((controllers) => {
        const userIds = controllers.map((c) => c.UserId);
        this.users = this.allUsers.filter((u) =>
          userIds.includes(u.AspNetUserId ?? -1)
        );
      });
    });
  }

  loadUsers(): Promise<void> {
    return new Promise((resolve) => {
      this.userService.getAllUsers().subscribe({
        next: (data) => {
          this.allUsers = data.filter((u) => u.IsActive && !u.IsDeleted);
          this.claimcontroller = this.allUsers.map((u) => ({
            id: u.AspNetUserId?.toString() ?? '',
            name: `${u.Firstname} ${u.Lastname}`,
          }));
          this.resizeGrid();
          resolve();
        },
        error: () => {
          this.toastr.show('Failed to fetch user data.', 'error');
          resolve();
        },
      });
    });
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.resizeGrid();
  }

  resizeGrid(): void {
    if (this.gridApi) {
      setTimeout(() => this.gridApi.sizeColumnsToFit(), 100);
    }
  }

  addControllerToGrid(): void {
    const selectedId = this.form.get('selectedClamController')?.value;
    if (!selectedId) {
      this.toastr.show('Please select a controller.', 'error');
      return;
    }

    const alreadyAdded = this.users.some(
      (u) => u.AspNetUserId?.toString() === selectedId
    );
    if (alreadyAdded) {
      this.toastr.show('Controller already added.', 'info');
      return;
    }

    const userToAdd = this.allUsers.find(
      (u) => u.AspNetUserId?.toString() === selectedId
    );
    if (!userToAdd) {
      this.toastr.show('User not found.', 'error');
      return;
    }

    const clonedUser = structuredClone(userToAdd);
    this.users = [...this.users, clonedUser];
    this.gridApi.applyTransaction({ add: [clonedUser] });

    this.updateTabState();
    this.form.get('selectedClamController')?.reset();
    this.toastr.show(`${clonedUser.Firstname} added to grid`, 'success');
  }

  unlinkController(user: User): void {
    const rowNode = this.gridApi.getRowNode(
      user.AspNetUserId?.toString() ?? ''
    );
    if (rowNode) {
      this.gridApi.applyTransaction({ remove: [rowNode.data] });
      this.users = this.users.filter(
        (u) => u.AspNetUserId !== user.AspNetUserId
      );

      this.updateTabState();
      this.toastr.show(`${user.Firstname} unlinked successfully.`, 'success');
    }
  }

  private updateTabState(): void {
    const controllers: ClientClaimController[] = this.users.map((u) => ({
      ClientClaimControllerId: 0,
      ClientId: 0,
      UserId: u.AspNetUserId ?? 0,
      IsDeleted: false,
      // User: this.mapUserToAspNetUser(u),
    }));
    this.tabStateService.updateClaimController(controllers);
  }

  private mapUserToAspNetUser(user: User): AspNetUser {
    return {
      AspNetUserId: user.AspNetUserId ?? 0,
      UserName: user.UserName,
      UserEmail: user.UserEmail,
      Firstname: user.Firstname,
      Lastname: user.Lastname,
      IsActive: user.IsActive,
      IsDeleted: user.IsDeleted ?? false,
    };
  }
}
