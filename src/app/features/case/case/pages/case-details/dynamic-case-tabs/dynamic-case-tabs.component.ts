import { Component } from '@angular/core';
import { CallerComponent } from '../tab-components/caller/caller/caller.component';
import { VoucherSmsComponent } from '../tab-components/voucher-sms/voucher-sms.component';
import { DocumentsComponent } from '../tab-components/documents/documents.component';
import { ValidationComponent } from '../tab-components/validation/validation.component';
import { ComplaintsComponent } from '../tab-components/complaints/complaints.component';
import { AddPhase1Component } from '../tab-components/add-phase1/add-phase1.component';
import { AddPhase2Component } from '../tab-components/add-phase2/add-phase2.component';
import { AddPhase3Component } from '../tab-components/add-phase3/add-phase3.component';
import { NgLabelTemplateDirective } from '@ng-select/ng-select';

@Component({
  selector: 'app-dynamic-case-tabs',
  standalone: false,
  templateUrl: './dynamic-case-tabs.component.html',
  styleUrl: './dynamic-case-tabs.component.css',
})
export class DynamicCaseTabsComponent {
tabs = [
  { label: 'Caller', type: 'caller' },
   { label: 'Deceased Info', type: 'deceased-info' },
  { label: 'Cause Of Death', type: 'cause-of-death' },
  { label: 'Validation', type: 'validation' },
  { label: 'Voucher/SMS', type: 'voucher' },
  { label: 'Complaints', type: 'complaints' },
  { label: 'Documents', type: 'documents' }
];

  selectedTab = 0;
  phaseCount = 0;
  maxPhases = 4;

  selectTab(index: number) {
    this.selectedTab = index;
  }

  onSelect() {
    console.log('Select from tab menu clicked');
  }

  toggleMenu() {
    if (this.phaseCount < this.maxPhases) {
      this.phaseCount++;
      const newPhaseLabel = `Phase ${this.phaseCount}`;
      const newPhaseType = `phase${this.phaseCount}`;
      this.tabs.push({ label: newPhaseLabel, type: newPhaseType });
      this.selectedTab = this.tabs.length - 1;
    }
  }

  removeTab(index: number, event: MouseEvent) {
    event.stopPropagation(); // prevent tab click event

    const tab = this.tabs[index];
    if (tab.type?.startsWith('phase')) {
      this.tabs.splice(index, 1);
      this.phaseCount = this.tabs.filter((t) =>
        t.type.startsWith('phase')
      ).length;

      // Adjust selected tab index if needed
      if (this.selectedTab >= this.tabs.length) {
        this.selectedTab = this.tabs.length - 1;
      }
    }
  }
}
