import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, FormsModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  message: string = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.credentials).subscribe(response => {
      if (response.success) {
        this.authService.saveUser(response.user);
        this.router.navigate(['/']);
      } else {
        this.message = response.message;
      }
    });
    this.loading = true;
    // 模擬登入 API
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  register(){
    this.router.navigate(['/register']);
  }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
