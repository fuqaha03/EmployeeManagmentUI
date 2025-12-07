import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/api/account/login`, credentials);
  }

  logout() {
    localStorage.removeItem('token');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
      const decoded = this.decodeToken(token);
  localStorage.setItem('role', decoded.role); 
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

private decodeToken(token: string): any {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
}

isEmployee(): boolean {
  return this.getRole() === 'Employee';
}

isAdmin(): boolean {
  return this.getRole() === 'Admin';
}

getCurrentEmployeeId(): Observable<object> {
   return this.http.get(`${environment.apiBaseUrl}/api/account/current-employee`);
}

}
