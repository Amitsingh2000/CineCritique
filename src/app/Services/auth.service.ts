import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: any;
  users: User[] = [];
  currUser: User = {
    FirstName: '',
    LastName: '',
    emailId: '',
    username: '',
    password: '',
    role: ''
  };

  constructor(private router: Router, private http: HttpClient) {}

  login(uname: string, pword: string): Observable<number> {
    return this.http.get<User[]>("assets/data/user-login.json").pipe(
      map((users) => {
        this.users = users;
        const foundUser = this.users.find(user => user.username === uname && user.password === pword);

        if (foundUser) {
          this.currUser = foundUser;
          if (this.isLocalStorageAvailable()) {
            localStorage.setItem("token", JSON.stringify(this.currUser));
          }
          if(this.currUser.role === 'admin')
            {
              localStorage.setItem("userRole",this.currUser.role);
              return 201;
            }
         
          return 200;

        } else {
          return 403;
        }
      }),
      catchError((error) => {
        console.error('Error fetching users', error);
        return of(403); // Return 403 if there is an error
      })
    );
  }

  isLoggedIn(): boolean {
    if (this.isLocalStorageAvailable()) {
      let token = localStorage.getItem("token");
      return token !== undefined && token !== '' && token !== null;
    }
    return false;
  }

  logout() {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
    }
    let errorMsg = 'User Logout Successfully';
    const navigationExtras: NavigationExtras = {
      queryParams: { error: errorMsg }
    };
    this.router.navigate(['login'], navigationExtras);
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
