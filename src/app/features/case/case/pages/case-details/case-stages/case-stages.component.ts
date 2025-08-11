import { Component } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-case-stages',
  standalone: false,
  templateUrl: './case-stages.component.html',
  styleUrl: './case-stages.component.css',
})
export class CaseStagesComponent {
  isLinear: boolean = true;
  activeIndex: number = 0;
  completedSteps: boolean[] = [false, false, false, false, false];

  resetStepper(stepper: MatStepper): void {
    this.completedSteps = [false, false, false, false, false]; // ✅ proper reset
    this.activeIndex = 0;
    stepper.reset(); // optional: resets Angular Material stepper
  }
  completeStep(stepper: MatStepper): void {
    this.completedSteps[this.activeIndex] = true;
    stepper.next();
    // Remove manual update of activeIndex here
  }
}
