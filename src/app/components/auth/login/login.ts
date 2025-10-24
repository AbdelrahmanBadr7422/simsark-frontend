import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Auth } from '../../../services/auth';
import { LoginResponse, UserLogin } from '../../../models/authModels';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login implements OnInit, OnDestroy {
  private _authService = inject(Auth);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

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

    this._authService.loginService(userLogin)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: LoginResponse) => {
          this.isLoading = false;
          this.loginStatusMsg = res.message;
          this.router.navigate(['/explore']);
        },
        error: (err: LoginResponse) => {
          this.isLoading = false;
          this.serverErrorMsg = err.message || 'Login failed. Please try again.';
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
