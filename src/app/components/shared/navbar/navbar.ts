import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../services/auth';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive,AsyncPipe],
  templateUrl: './navbar.html',
})
export class Navbar {
  private authService = inject(Auth);
  private router = inject(Router)
  isLogged$ = this.authService.isLogged$;
  isSeller$ = this.authService.isSeller$;

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
