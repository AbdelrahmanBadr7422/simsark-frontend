import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  userData = {
    fname: '',
    lname: '',
    email: '',
    password: '',
  };

  isEditing = {
    fname: false,
    lname: false,
    email: false,
    password: false,
  };

  constructor(private _authService: Auth) {}

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    this._authService.currentUser$.subscribe((user) => {
      if (user) {
        console.log('Logged-in user:', user.fname);
      } else {
        console.log('No user logged in.');
      }
    });
  }
}
