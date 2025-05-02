import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

declare var paypal: any; // 引入 PayPal SDK


@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements AfterViewInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  deliveryFee: number = 0;
timeSurcharge: number = 0;
// deliveryTime: string = '';
// deliveryDistrict: string = '';

  customer = {
    name: '',
    phone: '',
    address: '',
    deliveryMethod: '標準送貨',
    deliveryDate: '',
    deliveryTime:'',
    deliveryDistrict:''
  };

  orderSuccess: boolean = false;
  user_id: number | null = null; // 當前用戶 ID


  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadUser();
    this.loadCart();  }

  ngAfterViewInit() {
    this.loadPayPal();
  }

  // 📌 讀取購物車
  loadCart() {
    this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // 📌 讀取當前登入的用戶
loadUser() {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  if (userData && userData.id) {
    this.user_id = userData.id;
  } else {
    alert("⚠️ 請先登入帳號再進行結帳！");
    this.router.navigate(['/login']); // 🔄 如果未登入，跳轉到登入頁面
  }
}
//送貨地區
updateDeliveryFee() {
  const fees: { [key: string]: number } = {
    '中西區': 250, '灣仔區': 250, '東區': 250, '南區': 250,
    '油尖旺區': 250, '深水埗區': 250, '九龍城區': 180, '黃大仙區': 180, '觀塘區': 180,
    '葵青區': 250, '荃灣區': 250, '元朗區': 300, '屯門區': 300, '北區': 300,
    '大埔區': 300, '沙田區': 250, '西貢區': 250,
    '中環碼頭': 250, '東涌碼頭': 300,
    '馬灣': 500, '愉景灣': 700
  };
  this.deliveryFee = fees[this.customer.deliveryDistrict] || 0;
}
//送貨時間
updateTimeSurcharge() {
  const surchargeMap: { [key: string]: number } = {
    '6am-7am': 50, '7am-8am': 50,
    '20pm-21pm': 100, '21pm-22pm': 100, '22pm-23pm': 100, '23pm-24pm': 100,
  };
  this.timeSurcharge = surchargeMap[this.customer.deliveryTime] || 0;
}

get finalShippingCost() : number {
  return this.deliveryFee + this.timeSurcharge;
}

get finalTotal(): number {
  return this.totalPrice + this.finalShippingCost;
}


  loadPayPal() {
    paypal.Buttons({
      locale: 'zh_TW', // ✅ 強制使用繁體中文
      createOrder: (data: any, actions: any) => {
        if (!this.customer.name || !this.customer.phone ) {
          alert('❗ 請填寫完整的收件資訊再付款！');
          return actions.reject();
        }
  
        return actions.order.create({
          purchase_units: [{
            amount: { value: this.finalTotal.toFixed(2) }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          console.log('✅ 付款成功（Sandbox 模式）：', details);
          this.completeOrder(details);
        });
      },
      onError: (err: any) => {
        console.error('❌ 付款失敗：', err);
        alert('付款過程中出現錯誤，請稍後再試！');
      }
    }).render('#paypal-button-container');
  }
  
  // 📌 付款成功後執行
  completeOrder(paymentId: string) {
    const orderData = {
      ...this.customer,
      user_id:this.user_id,
      items: this.cartItems,
      total: this.finalTotal,
      // deliveryDistrict: this.deliveryDistrict,
      // deliveryTime: this.deliveryTime,
      deliveryFee: this.deliveryFee,
      timeSurcharge: this.timeSurcharge,
      totalShipping: this.finalShippingCost,
      totalAmount: this.finalTotal,
    };

    this.http.post('http://localhost/IT-Project/Project2/checkout.php', orderData)
  .subscribe({
    next: res => {
      console.log('✅ 訂單送出成功', res);
      this.orderSuccess = true;

      setTimeout(() => {
        this.router.navigate(['/orders']);
      }, 2000);
    },
    error: err => {
      console.error('❌ 提交錯誤', err);
    }
  });

  }
}