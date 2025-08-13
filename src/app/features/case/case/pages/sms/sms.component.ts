import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sms',
  standalone: false,
  templateUrl: './sms.component.html',
  styleUrl: './sms.component.css'
})
export class SmsComponent {
   @Input() caseRef: string = '';

}
