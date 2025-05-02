import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost/IT-Project/Project2/getAllOrders.php'; // ⚠️ 修改成你的 API 路徑

  constructor(private http: HttpClient) {}

  getOrders(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
