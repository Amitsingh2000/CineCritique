import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private router: Router, private auth: AuthService) { }
  isLogin() {
    return this.auth.isLoggedIn();
  }
  isuserAdmin() :boolean{
    if (this.isLocalStorageAvailable()) {
      if (localStorage.getItem("userRole") === 'admin') {
        return true;
      }
    }
    return false;
  }
  gotoLogin() {
    this.router.navigate(['login']);
  }
  goToHome() {
    this.router.navigate(['home']);
  }
  logout() {
    this.auth.logout();
  }
  goToDashboard() {
    this.router.navigate(['dashboard']);

  }
  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = 'test';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
}
