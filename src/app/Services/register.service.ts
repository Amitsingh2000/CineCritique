import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http:HttpClient) { }

  registerUser(user:User): Observable<any>
  {
    return this.http.post("http://localhost:3000/add-user",user);
  }
  getAllUsers(): Observable<any>
  {
    return this.http.get<any>("http://localhost:3000/users")
  }
  updateUser(username: string, user: User): Observable<any> {
    return this.http.put(`http://localhost:3000/update-user/${username}`, user);
  }
}
