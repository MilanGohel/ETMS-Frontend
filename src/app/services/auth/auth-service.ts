import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, retry, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { jwtDecode } from "jwt-decode";
import { setCurrentUser } from '../../stores/user-store/current-user.actions';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../stores/user-store/current-user.selectors';
import { ApiResponse, CurrentUserDto, ErrorResponse, GoogleLoginDto, LoginRequestDto, LoginResponseDto, SignUpRequestDto, UserNameExistsDto } from '../../core/models';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'AccessToken';
  private refreshTokenKey = 'RefreshToken';
  private apiUrl = environment.apiUrl;
  private router = inject(Router);
  private http = inject(HttpClient);
  private store = inject(Store);
  isAuthenticated$ = new BehaviorSubject<boolean | null>(null);

  currentUserProfile$ = this.store.select(selectCurrentUser);

  getUser(): Observable<ApiResponse<CurrentUserDto> | null> {
    return this.http.get<ApiResponse<CurrentUserDto>>(`${this.apiUrl}/api/auth/me`, {
      withCredentials: true
    }).pipe(
      tap(response => {
        this.isAuthenticated$.next(true);

        setCurrentUser({ user: response.data })
      }),
      catchError(error => {
        console.error('Failed to fetch user profile:', error);
        this.isAuthenticated$.next(false);
        return of(null);
      })
    );
  }


  login(email: string, password: string): Observable<ApiResponse<LoginResponseDto>> {
    const loginRequest: LoginRequestDto = { email, password };

    return this.http.post<ApiResponse<LoginResponseDto>>(
      `${this.apiUrl}/api/auth/login`,
      loginRequest
    ).pipe(
      tap(response => {
        if (response.succeeded) {
          console.log(response)
          localStorage.setItem("AccessToken", response.data.accessToken);
          localStorage.setItem("RefreshToken", response.data.refreshToken);
        }
        else {
          console.error(response.data);
        }
      }),
      catchError(error => {

        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  signUp(signUpRequest: SignUpRequestDto): Observable<ApiResponse<object> | ErrorResponse> {
    return this.http.post<ApiResponse<object> | ErrorResponse>(
      `${this.apiUrl}/api/auth/signup`,
      signUpRequest
    ).pipe(
      tap(response => {
        if (!response.succeeded) {
          const failedResponse: ErrorResponse = {
            succeeded: false,
            message: response.message,
            errors: [response.message],
            statusCode: response.statusCode
          }

          return of(failedResponse);
        }
        return response;
      })
      ,
      catchError((error: HttpErrorResponse) => {
        const failedResponse: ErrorResponse = {
          succeeded: false,
          message: error.error.message,
          errors: error.error,
          statusCode: error.status
        }
        return of(failedResponse);
      })
    )
  }

  verifyUser(token: string): Observable<ApiResponse<object> | ErrorResponse> {
    console.log("kjfdafjkd");
    const url = `${this.apiUrl}/api/Auth/magiclogin?token=${token}`

    return this.http.post<ApiResponse<object> | ErrorResponse>(
      url, null
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        const failedResponse: ErrorResponse = {
          succeeded: false,
          message: error.message,
          errors: error.error,
          statusCode: error.status
        }
        return of(failedResponse);
      })
    );
  }

  refreshToken(): Observable<ApiResponse<LoginResponseDto>> {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);

    const body = { refreshToken };
    return this.http.post<ApiResponse<LoginResponseDto>>(
      `${this.apiUrl}/api/auth/refresh`,
      body,
      { withCredentials: true }
    ).pipe(
      tap(
        response => {
          console.log(JSON.stringify(response));
          if (response.succeeded) {
            localStorage.setItem("AccessToken", response.data.accessToken);
            localStorage.setItem("RefreshToken", response.data.refreshToken);
          }
        }
      ),
      catchError(error => {
        console.error('Refresh Token failed: ', error)
        return throwError(() => error);
      })
    );
  }

  loginWithGoogle(googleLoginDto: GoogleLoginDto): Observable<ApiResponse<LoginResponseDto> | ErrorResponse> {
    return this.http.post<ApiResponse<LoginResponseDto>>(
      `${this.apiUrl}/api/auth/login/google`,
      googleLoginDto
    ).pipe(
      tap(response => {
        if (response.succeeded) {
          localStorage.setItem("AccessToken", response.data.accessToken);
          localStorage.setItem("RefreshToken", response.data.refreshToken);
        }
      }),
      catchError(error => {
        console.error('Google login failed: ', error);
        return throwError(() => error);
      })
    );
  }

  sendTokenToBackend(idToken: string, accessToken: string): void {
    const url = `${this.apiUrl}/api/auth/login/google`;
    const loginData = {
      idToken: idToken,
      accessToken: accessToken
    };

    this.http.post(url, loginData)
      .subscribe({
        next: (response) => {
          console.log('Backend login successful!', response);
          // TODO: Save your own app's JWT from the response and navigate away.
        },
        error: (error) => {
          console.error('Backend login failed:', error);
        }
      });
  }
  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshTokenKey);
    }
    this.router.navigate(["/login"]);
  }

  isValidTokens$(): Observable<boolean> {

    if (typeof window === 'undefined' || !window.localStorage) return of(false);

    const accessToken = localStorage.getItem(this.tokenKey);
    const refreshToken = localStorage.getItem(this.refreshTokenKey);

    if (!refreshToken) return of(false);

    if (!accessToken || this.isTokenExpired(accessToken)) {
      // Try refreshing the token
      return this.refreshToken().pipe(
        switchMap(() => {
          const newAccessToken = localStorage.getItem(this.tokenKey);
          if (!newAccessToken || this.isTokenExpired(newAccessToken) || this.isTokenExpired(refreshToken)) {
            return of(false);
          }

          if (this.currentUserProfile$) return of(true);

          return this.getUser().pipe(
            map(user => !!user),
            catchError(() => of(false))
          );
        }),
        catchError(() => of(false))
      );
    }

    // Access token was valid
    if (this.isTokenExpired(refreshToken)) return of(false);

    if (this.currentUserProfile$) return of(true);

    return this.getUser().pipe(
      map(user => !!user),
      catchError(() => of(false))
    );
  }


  getAccessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.isValidTokens$();
  }

  isTokenExpired(token: string): boolean {
    if (!token) {
      return true;
    }
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (!decodedToken.exp) {
        return true;
      }
      return decodedToken.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}
