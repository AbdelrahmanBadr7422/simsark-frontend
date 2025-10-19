import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
})
export class Profile {
  userData = {
    fname: 'John',
    lname: 'Doe',
    email: 'john@example.com',
  };

  fields = [
    { key: 'fname', label: 'First Name', value: 'John' },
    { key: 'lname', label: 'Last Name', value: 'Doe' },
    { key: 'email', label: 'Email', value: 'john@example.com' },
    { key: 'password', label: 'Password', value: '********' },
  ];

  resetToggle = true;
  passwordError = '';
  resetPassMsg = '';
  resetError = false;

  toggleResetBtn() {
    this.resetToggle = !this.resetToggle;
    this.passwordError = '';
    this.resetPassMsg = '';
  }

  saveNewPassword(newPassword: string) {
    if (newPassword.length < 6) {
      this.passwordError = 'Password must be at least 6 characters.';
      return;
    }

    setTimeout(() => {
      this.resetPassMsg = 'Password updated successfully!';
      this.resetError = false;
      this.resetToggle = true;
    }, 1000);
  }

  cancelReset() {
    this.resetToggle = true;
    this.passwordError = '';
    this.resetPassMsg = '';
  }
}
