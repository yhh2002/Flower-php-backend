import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, ReactiveFormsModule,CommonModule,],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: any = {};
  message: string = '';
  passwordFieldType: string = 'password';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = { ...this.authService.getUser(), password: '' }; // 確保密碼欄位為空
  }

  updateProfile() {
    if (!this.user.id) {
      this.message = "請先登入！";
      return;
    }

    this.authService.updateProfile(this.user).subscribe(response => {
      if (response.success) {
        this.message = "✅ 個人資料更新成功！";
        this.authService.saveUser(this.user); // 更新 localStorage
      } else {
        this.message = "❌ 更新失敗，請稍後再試！";
      }
    });
  }

  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}