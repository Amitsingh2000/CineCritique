import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { User } from '../Services/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterService } from '../Services/register.service';
import { response } from 'express';
import { Router } from '@angular/router';
import { error } from 'console';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HeaderComponent, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  userDetails: User =
    {
      FirstName: '',
      LastName: '',
      emailId: '',
      username: '',
      password: '',
      role: ''
    }
  constructor(private registerService: RegisterService,private router :Router) {
    this.userDetails.role="user";
  }
  registerUser() {
    this.registerService.registerUser(this.userDetails).subscribe(
      response => {
        let errorMsg = 'User Registered Successfully';
        const navigationExtras: NavigationExtras = {
          queryParams: { error: errorMsg }
        };
        this.router.navigate(['login'], navigationExtras);
      },
      error => {
        console.error('Error registering user', error);
      }
    )
  }

}
