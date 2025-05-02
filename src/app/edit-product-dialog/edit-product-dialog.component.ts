import { Component, Inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-edit-product-dialog',
  imports: [
    CommonModule,
    MatDialogModule, 
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatGridListModule, // ✅ 確保 MatGridListModule 被導入
    FormsModule
  ],
  templateUrl: './edit-product-dialog.component.html',
  styleUrl: './edit-product-dialog.component.css'
})
export class EditProductDialogComponent implements AfterViewInit{
  @ViewChild('dialogTitle') dialogTitle!: ElementRef;

  categories: string[] = ['玫瑰花束', '畢業花束', '母親節花束', '情人節花束', '開張花籃', '聖誕節🎄', '新年花卉'];

  constructor(
    public dialogRef: MatDialogRef<EditProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editingProduct: any
  ) {
    // ✅ 確保 `editingProduct` 不為 `null`
    if (!this.editingProduct) {
      this.editingProduct = { name: '', category: '', price: 0, description: '', image_url: '', stock_quantity: 0 };
    }
  }

  // ✅ 上傳新圖片
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", this.editingProduct.category);

    fetch("http://localhost/IT-Project/Project2/admin/uploadImage.php", {
      method: "POST",
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        this.editingProduct.image_url = data.image_url; // ✅ 更新圖片網址
        console.log("圖片上傳成功:", data.image_url);
      } else {
        console.error("圖片上傳失敗:", data.error);
      }
    })
    .catch(error => console.error("圖片上傳錯誤:", error));
  }

  // ✅ 更新產品
  updateProduct() {
    // ✅ 確保 `image_url` 不是 `0`
    if (this.editingProduct.image_url === "0" || !this.editingProduct.image_url) {
      console.warn("⚠️ `image_url` 無效，保留舊圖片");
      delete this.editingProduct.image_url;
    }
  
    fetch("http://localhost/IT-Project/Project2/admin/updateProduct.php", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.editingProduct),
    })
    .then(response => response.json())  // ✅ 確保返回 JSON
    .then(data => {
      if (data.success) {
        console.log("✅ 產品更新成功:", data);
        this.dialogRef.close(this.editingProduct);
      } else {
        console.error("❌ 產品更新失敗:", data.error);
      }
    })
    .catch(error => console.error("❌ 更新錯誤:", error));
  }
  
  
  


  ngAfterViewInit() {
    // ✅ 確保 Dialog 可以獲取焦點，避免 `aria-hidden` 問題
    setTimeout(() => {
      this.dialogTitle?.nativeElement.focus();
    }, 100);
  }

  // updateImagePath() {
  //   if (this.editingProduct.image_url) {
  //     this.editingProduct.image_url = `${this.editingProduct.image_url.replace(/\\/g, "/")}`;
  //   }
  // }
  


  closeDialog(): void {
    this.dialogRef.close();
  }

}
