import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost/IT-Project/Project2';


  // private apiUrl = 'http://localhost/IT-Project/Project/getAllProducts.php';
  private productDetailUrl = 'http://localhost/IT-Project/Project2/getProductByID.php';

  constructor(private http: HttpClient) {}

  // 取得所有產品
  getProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAllProducts.php`);  }

    getProducts2(): Observable<any> {
      return this.http.get<any>("http://localhost/IT-Project/Project2/admin/getAllProducts.php");
    }

  // 取得單一產品
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.productDetailUrl}?searchKey=${id}`);
  }

  addProduct(product: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/admin/addProduct.php`, product);
  }

  updateProduct(product: any): Observable<any> {   
     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.apiUrl}/admin/updateProduct.php`, product, { headers });
  }

  deleteProduct(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/admin/deleteProduct.php`, { id }, { headers: headers });
  }
  
  
  
}
