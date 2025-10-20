import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../services/auth';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-forget-pass',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forget-pass.html',
})
export class ForgetPass {
  private _authService = inject(Auth);
  private _fb = inject(FormBuilder);

  forgetPasswordForm = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  isLoading = false;
  successMsg = '';
  serverErrorMsg = '';

  onSubmit() {
    if (this.forgetPasswordForm.invalid) return;

    this.isLoading = true;
    this.successMsg = '';
    this.serverErrorMsg = '';

    const email = this.forgetPasswordForm.value.email!;

    this._authService.forgetPassService(email).subscribe({
      next: (res) => {
        this.successMsg = res.message || 'Reset link sent successfully!';
        this.isLoading = false;
      },
      error: (err) => {
        this.serverErrorMsg = err?.error?.message || 'Failed to send reset link.';
        this.isLoading = false;
      },
    });
  }
}
