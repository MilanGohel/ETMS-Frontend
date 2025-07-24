import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>("/api/auth/login", { email, password })
      .pipe(
        tap(
          response => {
            if (typeof window !== 'undefined' && window.localStorage) {
              localStorage.setItem(this.tokenKey, response.token);
            }
          }
        )
      )
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.tokenKey);
    }
    this.router.navigate(["/login"]);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): any {
    const token = this.getToken();
    if (!token) return null;

    const payload = atob(token.split(".")[1]);
    return JSON.parse(payload);
  }
}
