import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-pass.html',
})
export class ResetPass {
  private _fb = inject(FormBuilder);
  private _authService = inject(Auth);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  showPassword = false;
  token: string = '';
  isLoading = false;
  successMsg = '';
  serverErrorMsg = '';

  resetForm = this._fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordsMatch }
  );

  ngOnInit() {
    this.token = this._route.snapshot.paramMap.get('token') || '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  passwordsMatch(group: any) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid) return;

    this.isLoading = true;
    const password = this.resetForm.value.password!;

    this._authService.resetPassService(password, this.token).subscribe({
      next: (res) => {
        this.successMsg = res.message || 'Password reset successfully!';
        this.isLoading = false;

        setTimeout(() => this._router.navigate(['/auth/login']), 3000);
      },
      error: (err) => {
        this.serverErrorMsg = err?.error?.message || 'Failed to reset password.';
        this.isLoading = false;
      },
    });
  }
}
