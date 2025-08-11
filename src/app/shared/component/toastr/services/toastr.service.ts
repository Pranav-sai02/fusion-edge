import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastrMessage } from '../models/toastr';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  private _messages$ = new BehaviorSubject<ToastrMessage[]>([]);
  public readonly toasts$ = this._messages$.asObservable();

  private timeoutMap = new Map<string, any>();

  show(message: string, type: ToastrMessage['type'], title?: string, duration = 3000) {
    const toast: ToastrMessage = {
      id: uuid(),
      message,
      title,
      type,
      duration,
      isClosing: false,
      
    };

    this._messages$.next([toast, ...this._messages$.value]);

    const timeout = setTimeout(() => {
      this.triggerClose(toast.id);
    }, duration);

    this.timeoutMap.set(toast.id, timeout);
  }

  private triggerClose(id: string) {
    const current = this._messages$.value;
    const index = current.findIndex(t => t.id === id);
    if (index !== -1) {
      current[index].isClosing = true;
      this._messages$.next([...current]);

      // Delay removal for animation
      setTimeout(() => this.dismiss(id), 300);
    }
  }

  dismiss(id: string) {
    clearTimeout(this.timeoutMap.get(id));
    this.timeoutMap.delete(id);

    const filtered = this._messages$.value.filter(t => t.id !== id);
    this._messages$.next(filtered);
  }

  clear() {
    this.timeoutMap.forEach(clearTimeout);
    this.timeoutMap.clear();
    this._messages$.next([]);
  }
}
