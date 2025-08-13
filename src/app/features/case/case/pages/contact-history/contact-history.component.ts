import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contact-history',
  standalone: false,
  templateUrl: './contact-history.component.html',
  styleUrl: './contact-history.component.css'
})
export class ContactHistoryComponent {


   @Input() caseRef: string = '';
}
