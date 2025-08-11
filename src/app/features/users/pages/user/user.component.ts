import { Component, Input, OnInit } from '@angular/core';
import {
  CellClickedEvent,
  ColDef,
  GridApi,
  GridOptions,
  ICellRendererParams,
} from 'ag-grid-community';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { ViewButtonRendererComponent } from '../../../../shared/component/view-button-renderer/view-button-renderer.component';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  @Input() userData!: User;

  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;
  ViewButtonRendererComponent = ViewButtonRendererComponent;

  users: User[] = [];
  gridApi!: GridApi;

  selectedUser: User | null = null; // row reference
  editedUser: User = {} as User; // detached copy for editing

  defaultImage = 'assets/images/profile.png';

  toggleOptions = false;
  saving = false; // spinner flag

  /* === AG‑Grid options === */
  gridOptions: GridOptions = {
    context: { componentParent: this },
    getRowId: (params) => params.data.id?.toString() ?? params.data.userEmail,
  };

  columnDefs: ColDef<User>[] = [
    {
      field: 'Firstname',
      headerName: 'First Name',
      flex: 1,
      minWidth: 200,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'Lastname',
      headerName: 'Last Name',
      flex: 2,
      minWidth: 250,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'UserEmail',
      headerName: 'Email',
      flex: 1,
      minWidth: 350,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'PhoneNumber',
      headerName: 'Phone Number',
      flex: 1,
      minWidth: 200,
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      valueFormatter: (params) => {
        // Show only national number (without +91, +1, etc.)
        const fullNumber = params.value;
        if (!fullNumber) return '';
        try {
          const parsed = parsePhoneNumberFromString(fullNumber);
          return parsed ? parsed.nationalNumber : fullNumber;
        } catch {
          return fullNumber;
        }
      },
      headerClass: 'bold-header',
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      flex: 1,
      minWidth: 200,
      cellRenderer: 'activeToggleRenderer',
      cellRendererParams: (params: ICellRendererParams<User>) => {
        return {
          isDisabled: true, // or use a condition like: !params.data.IsEditable
          // isDisabled: params.data.Role === 'Admin'
        };
      },
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
      sortable: false,
      filter: false,
      flex: 1,
      maxWidth: 90,
      cellRenderer: 'viewButtonRenderer',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '17px',
      },
      onCellClicked: (params: CellClickedEvent) => this.openPopup(params.data),
      headerClass: 'bold-header',
    },

    {
      suppressHeaderMenuButton: true,
      pinned: 'right',
      sortable: false,
      filter: false,
      flex: 1,
      maxWidth: 100,
      cellRenderer: 'softDeleteRenderer',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
      onCellClicked: (params: CellClickedEvent) =>
        this.softDeleteProvider(params.data),
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
    private toastr: ToastrService
  ) {}

  /* === lifecycle === */
  ngOnInit(): void {
    this.loadUsers();
  }

  resizeGrid(): void {
    if (this.gridApi) {
      setTimeout(() => this.gridApi.sizeColumnsToFit(), 100);
    }
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data
          .filter((u) => !u.IsDeleted)
          .sort((a, b) => (b.AspNetUserId ?? 0) - (a.AspNetUserId ?? 0)); // Sort: newest on top
        this.resizeGrid();
      },
      error: (err) => {
        console.warn('[UserComponent] Failed to load users.', err);
        this.toastr.show('Failed to fetch user data.', 'error');
      },
    });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.resizeGrid();
  }

  onExport(): void {
    this.gridApi.exportDataAsCsv({
      fileName: 'users.csv',
      columnSeparator: ',',
      allColumns: true,
    });
  }

  /* === popup handlers === */
  openPopup(user: User): void {
    this.selectedUser = user;
    this.editedUser = { ...user }; // shallow copy fine for flat object
    this.toggleOptions = false;
  }

  closePopup(): void {
    this.selectedUser = null;
  }

  updateUser(): void {
    if (!this.selectedUser) return;

    this.saving = true;
    this.userService
      .updateUser(this.editedUser.UserName!, this.editedUser)
      .subscribe({
        next: (updated) => {
          this.gridApi.applyTransaction({ update: [updated] }); // <-- THIS handles replacement
          this.toastr.show('User updated successfully.', 'success');
          this.closePopup();
        },
        error: (err) => {
          console.error('[UserComponent] updateUser failed', err);
          this.toastr.show('Failed to update user.', 'error');
        },
        complete: () => (this.saving = false),
      });
  }

  softDeleteProvider(user: User): void {
    if (!user || !this.gridApi) return;

    // 🔥 Show info toaster
    this.toastr.show(`Deleting ${user.UserEmail}...`, 'info');

    // Call PUT with updated IsDeleted
    this.userService.softDelete(user).subscribe({
      next: (updatedUser) => {
        // Remove from local array
        this.users = this.users.filter(
          (u) => u.AspNetUserId !== updatedUser.AspNetUserId
        );

        const rowNode = this.gridApi.getRowNode(
          updatedUser.AspNetUserId?.toString() ?? updatedUser.UserEmail
        );

        if (rowNode) {
          this.gridApi.applyTransaction({ remove: [rowNode.data] });
          this.toastr.show(
            `Deleted ${updatedUser.UserEmail} successfully.`,
            'success'
          );
        }
      },
      error: (err) => {
        console.error('❌ Backend PUT delete failed:', err);
        this.toastr.show('Failed to delete user on server.', 'error');
      },
    });
  }

  /* === misc UI helpers === */
  clearField(
    field:
      | 'Firstname'
      | 'Lastname'
      | 'UserEmail'
      | 'MobileNumber'
      | 'EmployeeId'
      | 'PhoneNumber'
  ): void {
    (this.editedUser as any)[field] = '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      (this.editedUser.ProfileImage = reader.result as string);
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.editedUser.ProfileImage = '';
  }

  openCamera() {
    console.log('Camera action triggered');
  }

  saveUserToggleStatus(updatedUser: User): void {
    this.userService
      .updateUser(this.editedUser.UserName!, this.editedUser)
      .subscribe({
        next: (res) => {
          console.log(`IsActive status updated for ${res.UserEmail}`);
          this.toastr.show(`Status updated for ${res.UserEmail}`, 'success');
        },
        error: (err) => {
          console.error('Failed to update IsActive status', err);
          this.toastr.show('Failed to update active status.', 'error');
        },
      });
  }
}
