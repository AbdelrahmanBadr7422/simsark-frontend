import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  isLogged:boolean;
  isSeller:boolean;
  constructor(){
    this.isLogged = false;
    this.isSeller = false;
  }

  ngOnInit(): void {
    if(localStorage.getItem('authToken')!=null){
      this.isLogged = true;
    }
    if(localStorage.getItem('userRole')==="seller"){
      this.isSeller = true;
    }
  }

  logout(){
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  }
}
