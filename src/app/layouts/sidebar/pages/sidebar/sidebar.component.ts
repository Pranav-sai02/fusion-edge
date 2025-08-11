import { Component, Input, OnInit } from '@angular/core';
import { Sidebar } from '../../models/Sidebar';
import { SidebarService } from '../../services/sidebar.service';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { ToastrService } from '../../../../shared/component/toastr/services/toastr.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  groupedMenu: { [section: string]: Sidebar[] } = {};
  topLevelMenuItems: Sidebar[] = [];
  @Input() collapsed: boolean = false;

  // Custom display order of sections
  sectionOrder: string[] = [
    'Call Centre',
    'Client',
    'Services',
    'Rating Questions',
    'Configuration',
    'Transport',
    'Security',
    'Company',
    'Admin',
    'Import',
    'Reports',
    'Sms',
    'General',
  ];

  constructor(
    private sidebarService: SidebarService,
    private toaster: ToastrService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.loadMenuItems();
  }

  private loadMenuItems(): void {
    this.sidebarService.getMenuItems().subscribe({
      next: (items: Sidebar[]) => {
        const activeItems = items.filter((item) => item.IsActive);

        this.topLevelMenuItems = activeItems.filter((item) =>
          ['Home', 'DashBoard'].includes(item.MenuPath)
        );

        const groupableItems = activeItems
          .filter(
            (item) =>
              item.MenuPath.includes('/') &&
              !this.topLevelMenuItems.includes(item)
          )
          .sort((a, b) => a.MenuId - b.MenuId);

        this.groupedMenu = this.groupBySection(groupableItems);
      },
      error: (err) => {
        // console.error('Error fetching sidebar menu items:', err);
        this.logger.logError(err, 'SidebarComponent: getMenuItems failed');
        this.toaster.show(
          'Unable to load sidebar menu. Please try again later.','error'
        );
      },
    });
  }

  private groupBySection(items: Sidebar[]): { [section: string]: Sidebar[] } {
    const grouped: { [section: string]: Sidebar[] } = {};

    items.forEach((item) => {
      const pathParts = item.MenuPath.split('/');
      const sectionKey = (pathParts[0] || 'General').trim();
      const section = ['Cases', 'Call Centre'].includes(sectionKey)
        ? 'Call Centre'
        : this.sectionOrder.includes(sectionKey)
        ? sectionKey
        : 'General';

      if (!grouped[section]) {
        grouped[section] = [];
      }
      grouped[section].push(item);
    });

    // Sort within each group by MenuId
    for (const section in grouped) {
      grouped[section].sort((a, b) => a.MenuId - b.MenuId);
    }

    return grouped;
  }

  // trackBy function for better ngFor performance
  public trackByMenuId(index: number, item: Sidebar): number {
    return item.MenuId;
  }

  expandedSections: { [key: string]: boolean } = {};

  toggleSection(sectionKey: string): void {
    this.expandedSections[sectionKey] = !this.expandedSections[sectionKey];
  }

  isHovered: boolean = false;
  get isCollapsed(): boolean {
    return this.collapsed && !this.isHovered;
  }
  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
  }
}
