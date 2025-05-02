import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule,FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})

export class ForgotPasswordComponent {
  email: string = '';
  verificationCode: string = '';
  newPassword: string = '';
  step: number = 1; // 1: 輸入 Email, 2: 驗證碼, 3: 設定新密碼
  errorMessage: string = '';
  isSuccess: boolean = false;
  isLoading: boolean = false; // ✅ 新增 Loading 狀態

  constructor(private http: HttpClient, private router: Router) {}

  sendVerificationCode() {
    this.isLoading = true; // ✅ 開始 Loading

     this.http.post<any>('http://localhost/IT-Project/Project2/forgot-password.php', {
    action: 'send_code',
    email: this.email
  }, { responseType: 'text' as 'json' })
  .subscribe(
    response => {
      this.isLoading = false; // ✅ 結束 Loading

      try {
        const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
        if (parsedResponse.message) {
          this.errorMessage = parsedResponse.message;
          this.isSuccess = true;
          this.step = 2; // ✅ 讓畫面切換到「輸入驗證碼」
        } else if (parsedResponse.error) {
          this.errorMessage = parsedResponse.error;
          this.isSuccess = false;
        }
      } catch (e) {
        this.errorMessage = "❌ API 回應格式錯誤，請檢查伺服器！";
        console.error("❌ API 解析失敗：", response);
        this.isSuccess = false;
      }
    },
    error => {
      this.isLoading = false; // ✅ 結束 Loading
      this.handleError(error);
    }
    );
  }

  verifyCode() {
    this.http.post<any>('http://localhost/IT-Project/Project/forgot-password.php', {
      action: 'verify_code',
      email: this.email,
      code: this.verificationCode
    }, { responseType: 'text' as 'json' })
    .subscribe(
      response => this.handleApiResponse(response, 3),
      error => this.handleError(error)
    );
  }

  resetPassword() {
    this.http.post<any>('http://localhost/IT-Project/Project/forgot-password.php', {
      action: 'reset_password',
      email: this.email,
      new_password: this.newPassword
    }, { responseType: 'text' as 'json' })
    .subscribe(
      response => {
        this.handleApiResponse(response, 1);
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error => this.handleError(error)
    );
  }

  handleApiResponse(response: any, nextStep: number) {
    try {
      const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
      if (parsedResponse.message) {
        this.errorMessage = parsedResponse.message;
        this.isSuccess = true;
        this.step = nextStep;
      } else if (parsedResponse.error) {
        this.errorMessage = parsedResponse.error;
        this.isSuccess = false;
      }
    } catch (e) {
      this.errorMessage = "❌ API 回應格式錯誤，請檢查伺服器！";
      this.isSuccess = false;
    }
  }

  handleError(error: any) {
    console.error("API 請求錯誤：", error);
    this.errorMessage = "❌ 伺服器錯誤，請稍後再試！";
    this.isSuccess = false;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}