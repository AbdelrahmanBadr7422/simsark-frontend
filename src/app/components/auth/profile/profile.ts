import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '../../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  private _authService = inject(Auth);

  userData: any = {};
  fields: { key: string; label: string; value: string }[] = [];

  resetToggle = true;
  passwordError = '';
  resetPassMsg = '';
  resetError = false;
  showPassword = false;

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        this.userData = JSON.parse(storedUser);

        this.fields = [
          { key: 'fname', label: 'First Name', value: this.userData.fname || '' },
          { key: 'lname', label: 'Last Name', value: this.userData.lname || '' },
          { key: 'email', label: 'Email', value: this.userData.email || '' },
          { key: 'password', label: 'Password', value: '' },
        ];
      } catch (e) {
        console.error('Error parsing user data from localStorage', e);
      }
    } else {
      console.warn('No user data found in localStorage');
    }
  }

  toggleResetBtn() {
    this.resetToggle = !this.resetToggle;
    this.passwordError = '';
    this.resetPassMsg = '';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  saveNewPassword(newPassword: string) {
    if (!newPassword || newPassword.trim().length < 8) {
      this.passwordError = 'Password must be at least 8 characters.';
      return;
    }

    this.passwordError = '';
    this.resetError = false;
    this.resetPassMsg = '';

    this._authService.changePassService(newPassword).subscribe({
      next: (res) => {
        this.resetPassMsg = res.message || 'Password updated successfully!';
        this.resetError = false;
        this.resetToggle = true;
      },
      error: (err) => {
        console.error('Error updating password:', err);
        this.passwordError = err?.error?.message || 'Failed to update password.';
        this.resetError = true;
      },
    });
  }

  cancelReset() {
    this.resetToggle = true;
    this.passwordError = '';
    this.resetPassMsg = '';
  }
}
