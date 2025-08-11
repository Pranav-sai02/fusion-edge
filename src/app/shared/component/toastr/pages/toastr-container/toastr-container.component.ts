import { Component } from '@angular/core';
import { ToastrService } from '../../services/toastr.service';

@Component({
  selector: 'app-toastr-container',
  standalone: false,
  templateUrl: './toastr-container.component.html',
  styleUrl: './toastr-container.component.css',
})
export class ToastrContainerComponent {
  constructor(public toastrService: ToastrService) {}

  dismissToast(id: string) {
    this.toastrService.dismiss(id);
  }

   trackById(index: number, toast: any) {
    return toast.id;
  }
}
