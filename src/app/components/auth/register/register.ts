import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { passwordsMatchValidator } from '../../../validators/passwords-match.validator';
import { UserRoleValidator } from '../../../validators/user-role.validator';
import { RegisterResponse, UserRegister, UserRoleEnum } from '../../../models/authModels';
import { Auth } from '../../../services/auth';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register implements OnInit, OnDestroy {
  private _authService = inject(Auth);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  registerForm!: FormGroup;
  registerStatusMsg = '';
  isLoading = false;
  serverErrorMsg = '';

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        fname: ['', [Validators.required, Validators.minLength(3)]],
        lname: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        role: ['', [Validators.required, UserRoleValidator()]],
      },
      { validators: passwordsMatchValidator() }
    );
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.serverErrorMsg = '';

    const { confirmPassword, ...formValue } = this.registerForm.value;

    const registerData: UserRegister = {
      ...formValue,
      role: formValue.role as UserRoleEnum,
    };

    this._authService
      .singupService(registerData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: RegisterResponse) => {
          this.registerStatusMsg = res.message;
          if (res.token) {
            localStorage.setItem('authToken', res.token);
          }
          if (res.data) {
            localStorage.setItem('userRole', res.data.role);
          }
          this.isLoading = false;
          this.router.navigate(['/explore']);
        },
        error: (err: RegisterResponse) => {
          this.isLoading = false;
          this.serverErrorMsg = err.message || 'Something went wrong. Please try again.';
        },
      });
  }

  get f() {
    return this.registerForm.controls;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
