import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './user.html',
})
export class User implements OnInit {
  sidebarOpen = false;
  isDesktop = false;
  isSeller = localStorage.getItem('userRole') === 'seller';

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', [])
  checkScreenSize() {
    this.isDesktop = window.innerWidth >= 768;
    if (this.isDesktop) {
      this.sidebarOpen = true;
    } else {
      this.sidebarOpen = false;
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    if (!this.isDesktop) {
      this.sidebarOpen = false;
    }
  }
}
