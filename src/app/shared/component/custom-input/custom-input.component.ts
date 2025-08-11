import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-input',
  standalone: false,
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.css',
})
export class CustomInputComponent {
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() inputClass: string = 'form-control';
}
