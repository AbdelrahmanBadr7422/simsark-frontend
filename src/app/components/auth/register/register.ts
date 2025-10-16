import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { passwordsMatchValidator } from '../../../validators/passwords-match.validator';
import { UserRoleValidator } from '../../../validators/user-role.validator';
import { RegisterResponse, UserRegister, UserRoleEnum } from '../../../models/authModels';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  private _authService = inject(Auth);
  private fb = inject(FormBuilder);
  private router = inject(Router);

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

    this._authService.singupService(registerData).subscribe({
      next: (res: RegisterResponse) => {
        this.registerStatusMsg = res.message;
        if (res.token) {
          localStorage.setItem('authToken', res.token);
        }
        if (res.data) {
          localStorage.setItem('userRole', res.data.role);
        }
        this.isLoading = false;
        this.router.navigate(['/home']);
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
}
