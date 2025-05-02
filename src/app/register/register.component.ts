import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = { name: '', email: '', phone: '', address: '', password: '' };
  message: string = '';
  passwordFieldType: string = 'password';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.user).subscribe(response => {
      if (response.success) {
        this.message = "註冊成功！請登入";
        setTimeout(() => this.router.navigate(['/login']), 2000);
      } else {
        this.message = response.message;
      }
    });
  }

  logIn(){
    this.router.navigate(['/login']);
  }

  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}