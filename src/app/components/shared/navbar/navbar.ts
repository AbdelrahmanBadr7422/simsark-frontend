import { Component, inject, signal, computed } from '@angular/core';
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
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  readonly isLogged$ = this.authService.isLogged$;
  readonly isSeller$ = this.authService.isSeller$;

  readonly menuOpen = signal(false);
  readonly dropdownOpen = signal(false);

  readonly isAnyMenuOpen = computed(() => this.menuOpen() || this.dropdownOpen());

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  toggleDropdown(): void {
    this.dropdownOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.dropdownOpen.set(false);
    this.router.navigate(['/home']);
  }
}
