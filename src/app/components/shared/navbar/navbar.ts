import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../services/auth';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, CommonModule, NgIf],
  templateUrl: './navbar.html',
})
export class Navbar {
  private authService = inject(Auth);
  private router = inject(Router);

  isLogged$ = this.authService.isLogged$;
  isSeller$ = this.authService.isSeller$;

  menuOpen = false;
  dropdownOpen = false; // ✅ Add this

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen; // ✅ Add this
  }

  logout() {
    this.authService.logout();
    this.dropdownOpen = false; // optional — close dropdown on logout
    this.router.navigate(['/home']);
  }
  closeMenu() {
    this.menuOpen = false;
  }
}
