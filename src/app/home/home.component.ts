import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { StarRatingComponent } from '../feature/star-rating/star-rating.component';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { MoviesServiceService } from '../Services/movies-service.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, HttpClientModule, CommonModule, NgbModule, StarRatingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  trendingMovies: any;
  theatreMovies: any;
  popularMovies: any;
  constructor(private http: HttpClient, private router: Router, private auth: AuthService, private movieService: MoviesServiceService) { };

  ngOnInit(): void {

    this.getTrendingMovies();
    this.getTheatreMovies();
    this.getPopularMovies();

  }
  getTrendingMovies() {
   this.movieService.getTrendingMovies().subscribe((movies:any)=>
  {
    this.trendingMovies = movies;
  });
  }

  getTheatreMovies() {
    this.movieService.getTheatreMovies().subscribe((movies:any)=>
    {
      this.theatreMovies =movies;
    });
  }

  getPopularMovies() {
      this.movieService.getPopularMovies().subscribe((movies:any)=>
      {
        this.popularMovies =movies;
      });
  }
  goToMovie(type: string, id: string) {
    this.router.navigate(['movie', type, id]);
  }
  ariaValueText(current: number, max: number) {
    return `${current} out of ${max} hearts`;
  }
}
