import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/authservice/auth.service';

import { ToastrService } from '../../../../../shared/component/toastr/services/toastr.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginObj: any = {
    userName: '',
    password: '',
  };
  showPassword = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    console.log('Login button clicked:', this.loginObj);
    const { userName, password } = this.loginObj;
    if (userName !== 'admin@gmail.com') {
      this.toastr.show('Email is not valid', 'error');
      return;
    }
    if (password !== 'admin') {
      this.toastr.show('Incorrect password', 'error');
      return;
    }
    if (this.authService.login(userName, password)) {
      this.toastr.show('Login Successful', 'success');
      console.log('Login successful, navigating...');
      this.router.navigate(['/home'], { replaceUrl: true });
    } else {
      this.toastr.show('Login failed', 'error');
    }
  }
}
