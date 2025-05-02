import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  product: any = null;
  selectedSize: string = 'M';
  selectedStems: number = 6;
  availableOptions: any[] = [];
  quantity: number = 1;
  cartMessage: string = '';
  
  stemOptions: { [key: string]: { stems: number; price: number; }[] } = {
    M: [
      { stems: 6, price: 688 },
      { stems: 10, price: 888 },
      { stems: 15, price: 1288 }
    ],
    L: [
      { stems: 6, price: 888 },
      { stems: 10, price: 1088 },
      { stems: 15, price: 1688 },
      { stems: 18, price: 1888 }
    ]
  };
  
  
  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe(
        (data) => {
          if (data?.header?.success && data.data.length > 0) {
            this.product = data.data[0];
          } else {
            console.error("API 回傳無效產品資料:", data);
            this.product = null; // ✅ 如果 API 無效，確保不會報錯
          }
        },
        (error) => {
          console.error("載入產品時發生錯誤:", error);
          this.product = null;
        }
      );
    }
    this.onSizeChange(); // 預設載入 M Size

  }

  onSizeChange() {
    this.availableOptions = this.stemOptions[this.selectedSize];
    this.selectedStems = this.availableOptions[0].stems;
  }
  
  onStemChange() {
    // 可加邏輯，如有需要變更價格等
  }

  addToCart() {
    const selectedOption = this.availableOptions.find(opt => opt.stems == this.selectedStems);
  const finalPrice = selectedOption ? selectedOption.price : 0;

  const cartItem = {
    id: this.product.id,
    name: `${this.product.name} - ${this.selectedSize} - ${this.selectedStems}枝`,
    price: finalPrice,
    quantity: this.quantity,
    image: this.product.image_url,
    size: this.selectedSize,
  stems: this.selectedStems
  };

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push(cartItem);
  localStorage.setItem('cart', JSON.stringify(cart));

  this.cartMessage = '✅ 已加入購物車';
  }

  showPopup: boolean = true;

closePopup() {
  this.showPopup = false;
}

}