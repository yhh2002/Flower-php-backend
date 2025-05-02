import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: any[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  orderSuccess: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartItems = cart;
    this.totalQuantity = cart.reduce((sum:number, item:any) => sum + item.quantity, 0);
    this.totalPrice = cart.reduce((sum:number, item:any) => sum + item.price * item.quantity, 0);
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.loadCart();
  }

  clearCart() {
    localStorage.removeItem('cart');
    this.cartItems = [];
    this.totalPrice = 0;
    this.totalQuantity = 0;
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);

  }
}