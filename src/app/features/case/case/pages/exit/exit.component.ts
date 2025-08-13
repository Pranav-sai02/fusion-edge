import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-exit',
  standalone: false,
  templateUrl: './exit.component.html',
  styleUrl: './exit.component.css'
})
export class ExitComponent {
   @Input() caseRef: string = '';

}
