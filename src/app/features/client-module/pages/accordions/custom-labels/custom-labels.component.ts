import { Component } from '@angular/core';
import { TabStateService } from '../../../services/tab-state-service/tab-state.service';

@Component({
  selector: 'app-custom-labels',
  standalone: false,
  templateUrl: './custom-labels.component.html',
  styleUrl: './custom-labels.component.css',
})
export class CustomLabelsComponent {
  policyFiles = ['File A', 'File B', 'File C'];
  roles = ['Controller', 'Claims Controller', 'Admin'];

  selectedPolicyFile: string = ''; // No default; will restore from state
  policyLabel: string = '';
  validate: boolean = false;

  validationLabels = {
    label1: '',
    label2: '',
    label3: '',
    label4: '',
    label5: '',
    label6: '',
  };

  constructor(public tabState: TabStateService) {}

  ngOnInit(): void {
    // Restore previously saved values from TabStateService
    this.tabState.getCustomLabels().subscribe((data) => {
      if (data) {
        this.selectedPolicyFile = data.PolicyFile || this.policyFiles[0];
        this.policyLabel = data.PolicyLabel || '';
        this.validate = data.Validate ?? false;

        this.validationLabels.label1 = data.ValidationLabel1 || '';
        this.validationLabels.label2 = data.ValidationLabel2 || '';
        this.validationLabels.label3 = data.ValidationLabel3 || '';
        this.validationLabels.label4 = data.ValidationLabel4 || '';
        this.validationLabels.label5 = data.ValidationLabel5 || '';
        this.validationLabels.label6 = data.ValidationLabel6 || '';
      }
    });
  }

  /** Auto-update TabStateService when any field changes */
  updateCustomLabels(): void {
    this.tabState.updateCustomLabels({
      PolicyFile: this.selectedPolicyFile,
      PolicyLabel: this.policyLabel,
      Validate: this.validate,
      ValidationLabel1: this.validationLabels.label1,
      ValidationLabel2: this.validationLabels.label2,
      ValidationLabel3: this.validationLabels.label3,
      ValidationLabel4: this.validationLabels.label4,
      ValidationLabel5: this.validationLabels.label5,
      ValidationLabel6: this.validationLabels.label6,
    });

    console.log('Custom Labels updated in TabState:', {
      file: this.selectedPolicyFile,
      policyLabel: this.policyLabel,
      validate: this.validate,
    });
  }
}
