import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-product',
  imports: [CommonModule, RouterModule, FormsModule], // ✅ 加入 FormsModule 讓 [(ngModel)] 可以用
  templateUrl: './all-product.component.html',
  styleUrl: './all-product.component.css'
})
export class AllProductComponent {
  products: any[] = []; // 產品的完整清單
  filteredProducts: any[] = []; // 🔍 搜尋後的產品清單
  searchText: string = ''; // 用戶輸入的搜尋文字
  selectedCategory: string = ''; // 目前選擇的類別
  uniqueCategories: string[] = ['玫瑰花束','畢業花束','母親節花束','情人節花束', '開張花籃', '聖誕節🎄', '新年花卉']; // 存放所有不重複的類別
  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data.data;
      this.filteredProducts = [...this.products]; // 預設顯示所有產品
      this.getUniqueCategories(); // ✅ 確保類別列表被正確設定
    });
  }

  filterProducts() {
    const search = this.searchText.toLowerCase();
    const category = this.selectedCategory;
  
    this.filteredProducts = this.products.filter(product => {
      const matchName = product.name.toLowerCase().includes(search);
      const matchCategory = category ? product.category === category : true;
      return matchName && matchCategory;
    });
  
    // 🔴 強制觸發變更偵測，確保 UI 即時更新
    setTimeout(() => {}, 0);
  }
  

  // ❌ 清除搜尋
  clearSearch() {
    this.searchText = '';
    this.filterProducts();
  }

    // 📌 取得所有不重複的類別
    getUniqueCategories() {
      const predefinedCategories = ['玫瑰花束', '畢業花束', '母親節花束', '情人節花束', '開張花籃', '聖誕節🎄', '新年花卉'];
  const categoriesSet = new Set([...predefinedCategories, ...this.products.map(product => product.category)]);
  this.uniqueCategories = Array.from(categoriesSet);
    }
}
