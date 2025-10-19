import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../services/auth';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, AsyncPipe, CommonModule, NgIf],
  templateUrl: './navbar.html',
})
export class Navbar {
  private authService = inject(Auth);
  private router = inject(Router);
  isLogged$ = this.authService.isLogged$;
  isSeller$ = this.authService.isSeller$;
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    console.log(this.menuOpen);
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
