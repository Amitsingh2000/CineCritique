import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StarRatingComponent } from '../feature/star-rating/star-rating.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Movie, Review } from './movie.model';
import { AuthService } from '../Services/auth.service';
import { User } from '../Services/user.model';

declare var bootstrap: any;

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [HeaderComponent, StarRatingComponent, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss'
})
export class MovieComponent implements OnInit {

  type = '';
  id = '';
  url = '';
  movies: Movie[] = [];  
  
  movie: Movie = {
    id: 0,
    name: "",
    cover: "",
    rating: 0,
    reviews: []
  }
  reviewInfo: Review = {
    author: "",
    published_on: "",
    review: "",
    rating: 0
  }

  constructor(private route: ActivatedRoute, private http: HttpClient, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.type = this.route.snapshot.params['type'];
    this.id = this.route.snapshot.params['id'];
    this.reviewInfo.published_on = this.getCurrentFormattedDate();
    this.getMovie();
  }

  getCurrentFormattedDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  getMovie(): void {
    const url = `http://localhost:3000/movies/${this.type}/${this.id}`;
    this.http.get<Movie>(url).subscribe((movie) => {
      this.movie = movie;
    }, (error) => {
      console.error('Error fetching movie:', error);
    });
  }

  rateMoive() {
    this.movie.reviews.push(this.reviewInfo);
    const updateUrl = `http://localhost:3000/movies/${this.type}/${this.id}`;
    this.http.put(updateUrl, this.movie).subscribe(
      (response) => {
        window.location.reload();
        this.reviewInfo = {
          author: "",
          published_on: this.getCurrentFormattedDate(),
          review: "",
          rating: 0
        };
      },
      (error) => {
        console.error("Error submitting review:", error);
      }
    );
  }

  onRatingChange(newRating: number): void {
    this.reviewInfo.rating = newRating;
  }
  onRateMovieClick(): void {
    if (this.auth.isLoggedIn()) {
      const modalElement = document.getElementById('rateMoiveModel');
      if (modalElement) {
        const rateMovieModal = new bootstrap.Modal(modalElement);
        rateMovieModal.show();
      } else {
        console.error('Modal element not found');
      }
    } else {
      let errorMsg = 'You Need To Login First';
      const navigationExtras: NavigationExtras = {
        queryParams: { error: errorMsg }
      };
      this.router.navigate(['login'], navigationExtras);
    }
  }
}
