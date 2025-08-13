import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

type ModalId  = 'contactHistory' | 'additionalCost' | 'abort' | 'exit' | 'sms' | 'email' | 'phaseCosting' | 'caseRating' | null;
type ModalKey = Exclude<ModalId, null>;

interface Mounted {
  contactHistory: boolean;
  additionalCost: boolean;
  abort: boolean;
  exit: boolean;
  sms: boolean;
  email: boolean;
  phaseCosting: boolean;
  caseRating: boolean;
}

@Component({
  selector: 'app-caller-case-header',
  standalone: false,
  templateUrl: './caller-case-header.component.html',
  styleUrls: ['./caller-case-header.component.css'], // ✅ plural
})
export class CallerCaseHeaderComponent implements OnInit {
  caseRef = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.caseRef = params.get('callRef') ?? '';
    });
  }

  /** Modal state */
  activeModal: ModalId = null;

  modalTitleMap: Record<ModalKey, string> = {
    contactHistory: 'Contact History',
    additionalCost: 'Additional Cost',
    abort: 'Abort',
    exit: 'Exit',
    sms: 'SMS',
    email: 'Send Email',
    phaseCosting: 'Phase Costing',
    caseRating: 'Case Rating',
  };

  mounted: Mounted = {
    contactHistory: false,
    additionalCost: false,
    abort: false,
    exit: false,
    sms: false,
    email: false,
    phaseCosting: false,
    caseRating: false,
  };

  openModal(id: ModalKey) {
    this.activeModal = id;
    if (!this.mounted[id]) this.mounted[id] = true; // mount once, keep alive
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.activeModal = null;
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.activeModal) this.closeModal(); }
}
