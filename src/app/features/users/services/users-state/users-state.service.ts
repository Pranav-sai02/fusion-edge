import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root',
})
export class UsersStateService {
  constructor() {}

  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  getUsers(): User[] {
    return this.usersSubject.getValue();
  }

  setUsers(users: User[]): void {
    this.usersSubject.next(users);
  }

  addUser(user: User): void {
    const current = this.getUsers();
    this.usersSubject.next([...current, user]);
  }

  removeUser(userId: number): void {
    const current = this.getUsers().filter((u) => u.AspNetUserId !== userId);
    this.usersSubject.next(current);
  }

  clear(): void {
    this.usersSubject.next([]);
  }
}
