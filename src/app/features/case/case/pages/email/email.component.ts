import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-email',
  standalone: false,
  templateUrl: './email.component.html',
  styleUrl: './email.component.css'
})
export class EmailComponent {
   @Input() caseRef: string = '';

}
