import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';
import { LoginResponse, UserLogin, UserRoleEnum } from '../../../models/authModels';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login implements OnInit {
  private _authService = inject(Auth);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm!: FormGroup;
  loginStatusMsg = '';
  serverErrorMsg = '';
  isLoading = false;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginStatusMsg = 'Please fill in all required fields.';
      return;
    }

    this.isLoading = true;
    this.serverErrorMsg = '';

    const userLogin: UserLogin = this.loginForm.value;

    this._authService.loginService(userLogin).subscribe({
      next: (res: LoginResponse) => {
        this.isLoading = false;
        this.loginStatusMsg = res.message;
        if (res.token) {
          localStorage.setItem('authToken', res.token);
        }
        if (res.data) {
          localStorage.setItem('userRole', res.data.role);
        }
        if (res.data?.role === UserRoleEnum.Seller) {
          this.router.navigate(['/create-post']);
        }
        if (res.data?.role === UserRoleEnum.Customer) {
          this.router.navigate(['/home']);
        }
      },
      error: (err: LoginResponse) => {
        this.isLoading = false;
        this.serverErrorMsg = err.message || 'Login failed. Please try again later.';
      },
    });
  }
}
