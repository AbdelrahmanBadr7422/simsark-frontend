import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../services/auth';
import { AuthResponse, LoginResponse, UserLogin } from '../../../models/authModels';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(Auth);

  loginForm!: FormGroup;
  loginStatusMessage: string = '';
  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginStatusMessage = 'Please fill in all required fields.';
      return;
    }
    const userLogin = this.loginForm.value;
    this._authService.loginService(userLogin).subscribe({
      next: (userRes: LoginResponse) => {
        if (userRes.token) {
          localStorage.setItem('authToken', userRes.token);
        }
        console.log(userRes);
        this.loginStatusMessage = 'Login successful!';
      },
      error: () => {
        this.loginStatusMessage = 'Login failed. Please try again later.';
      },
    });
  }
}
