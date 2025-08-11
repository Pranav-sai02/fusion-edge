import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  output,
} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogData } from '../../../../shared/component/confirm-dialog/models/ConfirmDialogData';
import { ConfirmDialogComponent } from '../../../../shared/component/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';


@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  currentDateTime: string = '';
  currentPage: string = '';
  currentDateOnly: string = '';
  showDropdown: boolean = false;

  @Output() sidebarToggle = new EventEmitter<void>();

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  constructor(
    private router: Router,
    private eRef: ElementRef,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private dialog: MatDialog
  ) {}

  setCurrentDateTime(): void {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };

    const dateOnlyOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    };
    this.currentDateTime = now.toLocaleDateString('en-US', options);
    this.currentDateOnly = now.toLocaleDateString('en-US', dateOnlyOptions);
  }

  logout() {
    console.log('Logging out...');
    this.showDropdown = false;

    // Clear any stored session or token (if applicable)
    localStorage.clear(); // or sessionStorage.clear();

    // Navigate to login page
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  ngOnInit(): void {
    this.setCurrentDateTime();
    this.updateBreadcrumb();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumb();
      });
  }

  updateBreadcrumb(): void {
    let route = this.activatedRoute.root;
    let breadcrumb = '';

    while (route.firstChild) {
      route = route.firstChild;
      if (route.snapshot.data['breadcrumb']) {
        breadcrumb = route.snapshot.data['breadcrumb'];
      }
    }

    this.currentPage = breadcrumb || 'Dashboard / Home';
  }

  // confirmLogout(event: MouseEvent): void {
  //   event.stopPropagation(); // prevent other click events

  //   const confirmed = window.confirm('Are you sure you want to logout?');

  //   if (confirmed) {
  //     this.logout();
  //   } else {
  //     // Do nothing
  //     console.log('Logout cancelled');
  //   }
  // }

  confirmLogout(event: MouseEvent): void {
    event.stopPropagation();

    const dialogData: ConfirmDialogData = {
      title: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel',
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.logout();
        this.toastrService.show('You have logged out successfully.', 'success');
      } else {
        this.toastrService.show('Logout cancelled.', 'info');
      }
    });
  }
}
