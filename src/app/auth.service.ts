import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost/IT-Project/Project2/';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}register.php`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}login.php`, credentials, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  logout() {
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('user') !== null;
  }

  updateProfile(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}updateProfile.php`, user);
  }

  getUserId(): number | null {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user && user.id ? user.id : null;
  }


 
  forgotPassword(email: string){
    return this.http.post<{ message: string }>('http://localhost/IT-Project/Project2/forgot-password.php', { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post<{ message: string }>('/api/auth/reset-password', { token, newPassword });
  }
  
  
}
