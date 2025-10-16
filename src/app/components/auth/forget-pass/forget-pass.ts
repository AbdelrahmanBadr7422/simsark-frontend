import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../services/auth';
import { finalize } from 'rxjs';
import { PasswordResponse } from '../../../models/authModels';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forget-pass',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './forget-pass.html',
})
export class ForgetPass {
  resetPasswordForm!: FormGroup;
  isLoadingReset = false;
  resetStatusMsg: string | null = null;
  resetServerErrorMsg: string | null = null;

  private fb: FormBuilder = inject(FormBuilder);
  private _authService = inject(Auth);

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onResetSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoadingReset = true;
    this.resetStatusMsg = null;
    this.resetServerErrorMsg = null;

    const email = this.resetPasswordForm.get('email')?.value;

    this._authService
      .forgetPassService(email)
      .pipe(finalize(() => (this.isLoadingReset = false)))
      .subscribe({
        next: (response: PasswordResponse) => {
          this.resetStatusMsg = response.message;
          this.resetPasswordForm.reset();
        },
        error: (error: PasswordResponse) => {
          console.log('object');
          this.resetServerErrorMsg =
            error.message || 'Failed to send reset email. Please try again.';
        },
      });
  }
}
