import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpResponse,HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-top-menu',
  imports: [FormsModule, ReactiveFormsModule,CommonModule,],
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.css'
})
export class TopMenuComponent {
  showUserMenu: boolean = false;
  private menuTimeout: any; // 用來存放計時器
  currentUser: any = null;
  timeout: any;



  constructor(private router: Router, public authService: AuthService) {}

  closeUserMenu() {
    this.menuTimeout = setTimeout(() => {
      this.showUserMenu = false;
    }, 2000); // ✅ 2 秒後才關閉選單
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToAdmin(){
    this.router.navigate(['/admin']);
  }

  goToAllproduct() {
    this.router.navigate(['/']);
  }

  goToOrders() {
    this.router.navigate(['/orders']);
    this.showUserMenu = false; // ✅ 點擊「我的訂單」時關閉選單
  }

  toggleUserMenu() {
    clearTimeout(this.menuTimeout); // ❌ 清除即將執行的關閉動作
    this.showUserMenu = true;
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logIn(){
    this.router.navigate(['/login']);
  }

  showDropdown() {
    clearTimeout(this.timeout);
    this.showUserMenu = true;
  }
  
  hideDropdown() {
    this.timeout = setTimeout(() => {
      this.showUserMenu = false;
    }, 300); // 延遲 300ms 關閉
  }
  
}