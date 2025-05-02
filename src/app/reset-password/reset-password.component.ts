import { Component } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule,FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  password: string = '';
  confirmPassword: string = '';
  token: string = '';
  message: string = '';
  messageType: string = 'red';
  loading: boolean = false;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {
    this.token = this.route.snapshot.queryParams['token']; // 從 URL 取得 Token
  }

  resetPassword() {
    if (this.password !== this.confirmPassword) {
      this.message = '❌ 密碼不匹配！';
      this.messageType = 'red';
      return;
    }

    this.loading = true;
    this.authService.resetPassword(this.token, this.password).subscribe(
      response => {
        this.message = '✅ 密碼更新成功！請使用新密碼登入';
        this.messageType = 'green';
        setTimeout(() => this.router.navigate(['/login']), 2000);
        this.loading = false;
      },
      error => {
        this.message = '❌ 密碼重設失敗，請檢查連結是否正確！';
        this.messageType = 'red';
        this.loading = false;
      }
    );
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}