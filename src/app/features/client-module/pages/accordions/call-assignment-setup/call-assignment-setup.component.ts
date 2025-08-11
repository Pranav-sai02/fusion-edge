import { Component } from '@angular/core';

@Component({
  selector: 'app-call-assignment-setup',
  standalone: false,
  templateUrl: './call-assignment-setup.component.html',
  styleUrl: './call-assignment-setup.component.css',
})
export class CallAssignmentSetupComponent {

  selectedRole: number | null = null;

  roles = [
    { label: 'Controller',value:1},
    {label:'Claims Controller', value:2},
    {label:'Admin', value: 3},
    {label:'User', value: 4},
    {label:'Admin', value: 5},
    {label:'Admin', value: 6},
    {label:'User', value: 7}
  ];
}
