import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';

import { ErrorHandler } from './error-handler';
import { environment } from '../../environments/environment';
import {
  LoginResponse,
  PasswordResponse,
  RegisterResponse,
  User,
  UserLogin,
  UserRegister,
} from '../models/authModels';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private _httpClient = inject(HttpClient);
  private _errorHandler = inject(ErrorHandler);

  private authUrl = `${environment.apiBaseUrl}/auth`;

  private isLoggedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private isSellerSubject = new BehaviorSubject<boolean>(this.getRole() === 'seller');
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());

  isLogged$ = this.isLoggedSubject.asObservable();
  isSeller$ = this.isSellerSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  private hasToken(): boolean {
    return localStorage.getItem('authToken') !== null;
  }

  private getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem('userData');
    return userJson ? JSON.parse(userJson) : null;
  }

  //Signup Service
  singupService(userRegister: UserRegister): Observable<RegisterResponse> {
    return this._httpClient.post<RegisterResponse>(`${this.authUrl}/signup`, userRegister).pipe(
      tap((res: LoginResponse) => {
        if (res.token) {
          localStorage.setItem('authToken', res.token);
          this.isLoggedSubject.next(true);
        }
        if (res.data) {
          localStorage.setItem('userData', JSON.stringify(res.data));

          if (res.data.role) {
            localStorage.setItem('userRole', res.data.role);
            this.isSellerSubject.next(res.data.role === 'seller');
          }

          this.currentUserSubject.next(res.data);
        }
      }),
      catchError(this._errorHandler.handleError)
    );
  }

  //Login Service
  loginService(userLogin: UserLogin): Observable<LoginResponse> {
    return this._httpClient
      .post<LoginResponse>(`${this.authUrl}/login`, userLogin, {
        withCredentials: true,
      })
      .pipe(
        tap((res: LoginResponse) => {
          if (res.token) {
            localStorage.setItem('authToken', res.token);
            this.isLoggedSubject.next(true);
          }
          if (res.data) {
            localStorage.setItem('userData', JSON.stringify(res.data));

            if (res.data.role) {
              localStorage.setItem('userRole', res.data.role);
              this.isSellerSubject.next(res.data.role === 'seller');
            }

            this.currentUserSubject.next(res.data);
          }
        }),
        catchError(this._errorHandler.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    this.isLoggedSubject.next(false);
    this.isSellerSubject.next(false);
    this.currentUserSubject.next(null);
  }

  forgetPassService(email: string): Observable<PasswordResponse> {
    return this._httpClient
      .post<PasswordResponse>(`${this.authUrl}/forgotPassword`, { email: email })
      .pipe(catchError(this._errorHandler.handleError));
  }

  resetPassService(pass: string, token: string): Observable<PasswordResponse> {
    return this._httpClient
      .patch<PasswordResponse>(`${this.authUrl}/resetPassword/${token}`, { password: pass })
      .pipe(catchError(this._errorHandler.handleError));
  }

  changePassService(pass: string): Observable<PasswordResponse> {
    return this._httpClient
      .patch<PasswordResponse>(`${this.authUrl}/changePassword`, { password: pass })
      .pipe(catchError(this._errorHandler.handleError));
  }
}
