import { Component, Input } from '@angular/core';
import { NgComponentOutlet,  } from '@angular/common';
import { AllProductComponent } from '../all-product/all-product.component';
import { CartComponent } from '../cart/cart.component';
// import { HomeComponent } from '../home/home.component';
// import { LimitedTimeComponent } from '../limited-time/limited-time.component';
import { ProductDetailComponent } from '../product-detail/product-detail.component';


@Component({
  selector: 'app-core-content',
  imports: [NgComponentOutlet],
  templateUrl: './core-content.component.html',
  styleUrl: './core-content.component.css'
})
export class CoreContentComponent {
  @Input() menuItem='';
  targetComponent!: any;

  componentMap: any = {
    'AllProductComponent': AllProductComponent,
    'CartComponent':CartComponent,
    // 'HomeComponent':HomeComponent,
    // 'LimitedTimeComponent':LimitedTimeComponent,
    'ProductDetailComponent':ProductDetailComponent,
  }

  ngOnChanges() {
    this.targetComponent = this.componentMap[this.menuItem]
  }
}
