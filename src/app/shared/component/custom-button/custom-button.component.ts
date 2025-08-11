import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  standalone: false,
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.css',
})
export class CustomButtonComponent {
  @Input() label: string = 'Click';
  @Input() type: string = 'button';
  @Input() btnClass: string = 'btn-primary';
}
