
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { AllProductComponent } from './app/all-product/all-product.component';
import { ProductDetailComponent } from './app/product-detail/product-detail.component';
import { CartComponent } from './app/cart/cart.component';
import { OrdersComponent } from './app/orders/orders.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './app/login/login.component';
import { RegisterComponent } from './app/register/register.component';
import { ProfileComponent } from './app/profile/profile.component';
import { CheckoutComponent } from './app/checkout/checkout.component';
import { ForgotPasswordComponent } from './app/forgot-password/forgot-password.component';
import { AdminComponent } from './app/admin/admin.component';


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      MatDialogModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatButtonModule,
      MatOptionModule,
      BrowserAnimationsModule
    ),
    provideRouter([
      { path: '', component: AllProductComponent }, // 所有產品
      { path: 'product/:id', component: ProductDetailComponent }, // 產品詳情
      { path: 'cart', component: CartComponent }, // 購物車
      { path: 'orders', component: OrdersComponent }, // ✅ 訂單記錄頁面
      { path: 'login', component: LoginComponent }, // 🆕 登入頁面
      { path: 'register', component: RegisterComponent }, // 🆕 註冊頁面
      { path: 'profile', component: ProfileComponent },
      { path: 'checkout', component: CheckoutComponent }, // ✅ 新增 checkout 頁面
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'admin', component: AdminComponent }, // 🔥 新增管理者頁面

    ]),
    provideHttpClient(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(),
  ],
}).catch((err) => console.error(err));
