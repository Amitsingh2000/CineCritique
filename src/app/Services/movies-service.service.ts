import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviesServiceService {

  constructor(private http:HttpClient) { }

  getTrendingMovies():Observable<any>  {
    return this.http.get<any>('http://localhost:3000/movies/trending');
  }

  getTheatreMovies():Observable<any> {
    return this.http.get<any>('http://localhost:3000/movies/theatre');
  }

  getPopularMovies():Observable<any> {
    return this.http.get<any>('http://localhost:3000/movies/popular');
  }
  addMovie(type: string, movie: any): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/movies/${type}`, movie);
  }
}
