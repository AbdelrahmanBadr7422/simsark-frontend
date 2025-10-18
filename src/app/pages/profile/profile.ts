import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { PasswordResponse } from '../../models/authModels';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(Auth);

  @ViewChild('passInput') passInput!: ElementRef<HTMLInputElement>;

  resetToggle = true;
  passwordError: string | null = null;
  resetPassMsg: string | null = null;
  resetError = false;

  userData = {
    fname: '',
    lname: '',
    email: '',
    role: '',
    password: '',
  };

  fields: { key: string; label: string; type: string; value?: string }[] = [];

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userData = { ...user };
        this.fields = [
          { key: 'fname', label: 'First Name', type: 'text', value: user.fname },
          { key: 'lname', label: 'Last Name', type: 'text', value: user.lname },
          { key: 'email', label: 'Email', type: 'email', value: user.email },
          { key: 'role', label: 'Role', type: 'text', value: user.role },
          { key: 'password', label: 'Password', type: 'password', value: '********' },
        ];
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  toggleResetBtn(): void {
    const input = this.passInput.nativeElement;

    if (this.resetToggle) {
      input.disabled = false;
      input.readOnly = false;
      input.focus();
      this.passwordError = null;
    } else {
      const password = input.value.trim();

      if (!password) {
        this.passwordError = 'Password is required.';
        return;
      }
      if (password.length < 8) {
        this.passwordError = 'Password must be at least 8 characters long.';
        return;
      }

      this.passwordError = null;
      input.value = ''
      input.disabled = true;
      this.resetPassword(password);
    }

    this.resetToggle = !this.resetToggle;
  }

  resetPassword(password: string): void {
    this.authService.resetPassService(password).subscribe({
      next: (res: PasswordResponse) => {
        this.resetPassMsg = res.message;
        this.resetError = false;
        setTimeout(() => (this.resetPassMsg = null), 3000);
      },
      error: (err: PasswordResponse) => {
        this.resetPassMsg = err.message || 'Something went wrong.';
        this.resetError = true;
        setTimeout(() => (this.resetPassMsg = null), 3000);
      },
    });
  }
}
