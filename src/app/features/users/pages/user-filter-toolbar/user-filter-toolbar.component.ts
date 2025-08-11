import { Component } from '@angular/core';

@Component({
  selector: 'app-user-filter-toolbar',
  standalone: false,
  templateUrl: './user-filter-toolbar.component.html',
  styleUrl: './user-filter-toolbar.component.css',
})
export class UserFilterToolbarComponent {
  showPopup: boolean = false;

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}
