import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HeaderComponent, HttpClientModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = "";
  password = "";
  errorMsg = "";
  showError = false;

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.errorMsg = params['error'] || '';
      this.showError = !!this.errorMsg;
    });
  }

  login() {
    this.showError = false; // Reset alert visibility before setting a new error

    if (this.username.trim().length === 0) {
      this.errorMsg = "Username is required";
      this.showError = true;
    } else if (this.password.trim().length === 0) {
      this.errorMsg = "Password is required";
      this.showError = true;
    } else {
      this.auth.login(this.username, this.password).subscribe(
        (res) => {
          if (res === 200) {
            this.router.navigate(['home']);
          }
          else if (res === 201) {
            this.router.navigate(['dashboard']);
          }
          else {
            this.errorMsg = "Invalid Username or Password";
            this.showError = true;
          }
        },
        (error) => {
          console.error('Error logging in', error);
          this.errorMsg = "Error logging in";
          this.showError = true;
        }
      );
    }
  }

  closeAlert() {
    this.showError = false;
  }
}
