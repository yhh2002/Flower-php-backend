import { Component } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../order.service';
import { ProductService } from '../product.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProductDialogComponent } from '../edit-product-dialog/edit-product-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, MatDialogModule], // ✅ 正確導入 MatDialogModule
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  selectedSection: 'products' | 'orders' = 'products'; // ✅ 明確指定可選值
  products: any[] = [];
  newProduct: any = { name: '', category: '', price: 0, description: '', image_url: '', stock_quantity: 0 };
  orders: any[] = [];
  editingProduct: any = null;
 // ✅ 限制「類別」只能選擇這些選項
// ✅ 確保這些類別不會變動
categories: string[] = ['玫瑰花束', '畢業花束', '母親節花束', '情人節花束', '開張花籃', '聖誕節🎄', '新年花卉'];

selectedCategoryFilter: string = '';
selectedDeliveryFilter: string = '';


  constructor(private orderService: OrderService,private productService: ProductService,private dialog: MatDialog) {}

  ngOnInit() {
    this.loadProducts();
    this.loadOrders();
  }



  // 📜 取得訂單列表
  loadOrders() {
    this.orderService.getOrders().subscribe((data) => {
      if (data.success) {
        this.orders = data.orders;
      }
    });  }
  
    // 📦 取得產品列表
    loadProducts() {
      this.productService.getProducts2().subscribe((data: any) => {
        console.log("API 回應:", data); // ✅ 檢查 `data` 的內容
    
        if (!data || !data.products || !Array.isArray(data.products)) {
          console.error("錯誤: `data.products` 不是陣列", data);
          return;
        }
    
        this.products = data.products.map((product: any) => ({
          ...product,
          image_url: product.image_url ? product.image_url : 'assets/images/default.png' // ✅ 預設圖片
        }));
    
        console.log("處理後的產品資料:", this.products);
      });
    }
    
  
    // ➕ 新增產品
    addProduct() {
      if (!this.newProduct.name || this.newProduct.price <= 0 || this.newProduct.stock_quantity < 0) {
        alert('請輸入完整且正確的產品資料！');
        return;
      }
  
      this.productService.addProduct(this.newProduct).subscribe((res) => {
        if (res.success) {
          this.loadProducts();
          this.newProduct = { name: '', category: '', price: 0, description: '', image_url: '', stock_quantity: 0 };
        } else {
          alert("新增產品失敗：" + res.error);
        }
      }, (error) => {
        console.error("API 錯誤", error);
      });
    }
  
    // ✏️ 編輯產品
  // editProduct(product: any) {
  //   this.editingProduct = { ...product };
  // }

  // ✏️ 打開編輯產品 `Dialog`
  openEditDialog(product: any): void {
    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      width: '400px',
      data: { ...product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateProduct(result);
      }
    });
  }

  updateProduct(product: any) {
    if (!product || !product.name) {
      console.error("更新失敗: 產品資料無效", product);
      return;
    }
  
    console.log("更新產品:", product);
    this.productService.updateProduct(product).subscribe((res) => {
      if (res.success) {
        this.loadProducts();
      } else {
        alert("更新產品失敗：" + res.error);
      }
    }, (error) => {
      console.error("API 錯誤", error);
    });
  }

  // 🗑️ 刪除產品
  deleteProduct(productId: number) {
    if (confirm('確定要刪除這個產品嗎？')) {
      this.productService.deleteProduct(productId).subscribe((res) => {
        if (res.success) {
          this.loadProducts();
        } else {
          alert("刪除產品失敗：" + res.error);
        }
      }, (error) => {
        console.error("API 錯誤", error);
      });
    }
  }

  updateImagePathForNewProduct() {
    if (this.newProduct.image_url) {
      const categoryFolder = this.getCategoryFolder(this.newProduct.category);
      if (categoryFolder) {
        this.newProduct.image_url = `${categoryFolder}/${this.newProduct.image_url.replace(/\\/g, "/")}`;
      } else {
        this.newProduct.image_url = this.newProduct.image_url.replace(/\\/g, "/");
      }
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
  
    // ✅ 檢查是否已選擇類別
    if (!this.newProduct.category || this.newProduct.category.trim() === '') {
      alert("請先選擇類別，再上傳圖片！");
      return;
    }
  
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", this.newProduct.category);
  
      fetch("http://localhost/IT-Project/Project2/admin/uploadImage.php", {
        method: "POST",
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          this.newProduct.image_url = data.image_url; // ✅ 確保 `image_url` 正確
          console.log(data.message, "圖片路徑:", this.newProduct.image_url);
        } else {
          console.error("圖片處理失敗:", data.error);
        }
      })
      .catch(error => console.error("上傳錯誤:", error));
    }
  }
  
  
  
  
  getCategoryFolder(category: string | null | undefined): string {
    const categoryMap: { [key: string]: string } = {
      '玫瑰花束': '玫瑰花束',
      '畢業花束': '畢業花束',
      '母親節花束': '母親節花束',
      '情人節花束': '情人節花束',
      '開張花籃': '開張花籃',
      '聖誕節🎄': '聖誕節',
      '新年花卉': '新年花卉'
    };
  
    return categoryMap[category || ''] || ''; // ✅ 確保 category 不會是 null 或 undefined
  }


get filteredProducts() {
  if (!this.selectedCategoryFilter) {
    return this.products;
  }
  return this.products.filter(p => p.category === this.selectedCategoryFilter);
}

get filteredOrders() {
  if (!this.selectedDeliveryFilter) {
    return this.orders;
  }
  return this.orders.filter(order => order.delivery_method === this.selectedDeliveryFilter);
}

}


