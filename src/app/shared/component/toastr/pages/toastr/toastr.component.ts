import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { ToastrMessage } from '../../models/toastr';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-toastr',
  standalone: false,
  templateUrl: './toastr.component.html',
  styleUrl: './toastr.component.css',
  animations: [
    trigger('toastAnim', [
      state('visible', style({ transform: 'translateX(0)', opacity: 1 })),
      state('hidden', style({ transform: 'translateX(100%)', opacity: 0 })),
      transition('visible => hidden', [animate('300ms ease')]),
      transition('void => visible', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease'),
      ]),
    ]),
  ],
})
export class ToastrComponent {
  @Input() toast!: ToastrMessage;
  @Output() close = new EventEmitter<string>();

  @HostBinding('@toastAnim')
  get animationState() {
    return this.toast.isClosing ? 'hidden' : 'visible';
  }

  triggerClose(event?: Event) {
    if (event) event.stopPropagation();
    if (this.toast.isClosing) return;

    // Mark toast as closing (triggers animation)
    this.toast.isClosing = true;

    // Emit close after animation finishes
    setTimeout(() => {
      this.close.emit(this.toast.id);
    }, 300);
  }

  get toastClass(): string {
    return `toast-wrapper toaster-${this.toast.type}`;
  }
}
