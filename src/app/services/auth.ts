import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, Observable } from 'rxjs';

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

  //Signup Service
  singupService(userRegister: UserRegister): Observable<RegisterResponse> {
    return this._httpClient
      .post<RegisterResponse>(`${this.authUrl}/signup`, userRegister)
      .pipe(catchError(this._errorHandler.handleError));
  }

  //Login Service
  loginService(userLogin: UserLogin): Observable<LoginResponse> {
    return this._httpClient
      .post<LoginResponse>(`${this.authUrl}/login`, userLogin, {
        withCredentials: true,
      })
      .pipe(catchError(this._errorHandler.handleError));
  }
  //ForgetPass Service
  forgetPassService(email: string): Observable<PasswordResponse> {
    return this._httpClient
      .post<PasswordResponse>(`${this.authUrl}/forgetPassword`, { email: email })
      .pipe(catchError(this._errorHandler.handleError));
  }

  //ResetPass Service
  resetPassService(pass: string): Observable<PasswordResponse> {
    return this._httpClient
      .patch<PasswordResponse>(`${this.authUrl}/resetPassword`, pass)
      .pipe(catchError(this._errorHandler.handleError));
  }
}
