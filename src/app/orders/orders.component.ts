import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  orders: any[] = [];
  user_id: number | null = null;
  activeIndex: number | null = null;


  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.user_id = this.authService.getUserId();
    if (!this.user_id) {
      alert('❗ 請先登入！');
      return;
    }

    this.loadOrders();
  }

  loadOrders() {
    this.http.post<any>('http://localhost/IT-Project/Project2/getOrders.php', { user_id: this.user_id })
      .subscribe(response => {
        if (response.success) {
          this.orders = response.orders;
        } else {
          console.error('❌ 取得訂單失敗', response.message);
        }
      }, error => {
        console.error('❌ API 錯誤', error);
      });
  }

  toggleAccordion(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}