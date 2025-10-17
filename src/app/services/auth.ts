import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';

import { ErrorHandler } from './error-handler';
import { environment } from '../../environments/environment';
import {
  LoginResponse,
  PasswordResponse,
  RegisterResponse,
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

  isLogged$ = this.isLoggedSubject.asObservable();
  isSeller$ = this.isSellerSubject.asObservable();

  private hasToken(): boolean {
    return localStorage.getItem('authToken') !== null;
  }

  private getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  //Signup Service
  singupService(userRegister: UserRegister): Observable<RegisterResponse> {
    return this._httpClient.post<RegisterResponse>(`${this.authUrl}/signup`, userRegister).pipe(
      tap((res: LoginResponse) => {
        if (res.token) {
          localStorage.setItem('authToken', res.token);
          this.isLoggedSubject.next(true);
        }
        if (res.data?.role) {
          localStorage.setItem('userRole', res.data?.role);
        }
        this.isSellerSubject.next(res.data?.role === 'seller');
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
          if (res.data?.role) {
            localStorage.setItem('userRole', res.data?.role);
          }
          this.isSellerSubject.next(res.data?.role === 'seller');
        }),
        catchError(this._errorHandler.handleError)
      );
  }

  // logout
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    this.isLoggedSubject.next(false);
    this.isSellerSubject.next(false);
  }

  //ForgetPass Service
  forgetPassService(email: string): Observable<PasswordResponse> {
    return this._httpClient
      .post<PasswordResponse>(`${this.authUrl}/forgotPassword`, { email: email })
      .pipe(catchError(this._errorHandler.handleError));
  }

  //ResetPass Service
  resetPassService(pass: string): Observable<PasswordResponse> {
    return this._httpClient
      .patch<PasswordResponse>(`${this.authUrl}/resetPassword`, { password: pass })
      .pipe(catchError(this._errorHandler.handleError));
  }
}
