import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { MoviesServiceService } from '../Services/movies-service.service';
import { RegisterService } from '../Services/register.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { User } from '../Services/user.model';
import { FormsModule } from '@angular/forms';
import { Movie } from '../movie/movie.model';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  movieType = "";
  userDetails: User =
    {
      FirstName: '',
      LastName: '',
      emailId: '',
      username: '',
      password: '',
      role: 'User'
    }
  movieDetails: Movie = {
    id: 0,
    name: '',
    cover: '',
    rating: 0,
    reviews: []
  }

  display = "dashboard";
  trendingMovies: any;
  theatreMovies: any;
  popularMovies: any;
  allUsers: any;

  ngOnInit(): void {
    this.loadData();
  }

  constructor(private movieService: MoviesServiceService,private http: HttpClient, private userService: RegisterService, private registerService: RegisterService) { }

  showDashboard() {
    this.display = "dashboard";
  }
  showMovies() {
    this.display = "Movies"
  }
  showUsers() {
    this.display = "Users"
  }
  loadData() {
    this.movieService.getTrendingMovies().subscribe((movies: any) => {
      this.trendingMovies = movies;
    });
    this.movieService.getTheatreMovies().subscribe((movies: any) => {
      this.theatreMovies = movies;
    });
    this.movieService.getPopularMovies().subscribe((movies: any) => {
      this.popularMovies = movies;
    });
    this.userService.getAllUsers().subscribe((users: any) => {
      this.allUsers = users;
    });
  }

  addUser() {
    this.registerService.registerUser(this.userDetails).subscribe(
      response => {
        alert("User Register Sucessfully")
        window.location.reload();
      },
      error => {
        console.error('Error registering user', error);
      }
    )
  }
  addMovie() {
    this.movieService.addMovie(this.movieType, this.movieDetails).subscribe(
      response => {
        alert("Moive Register Sucessfully")
        window.location.reload();
      }, error => {
        console.error('Error registering Movie', error);
    }
    )
  }
  editMovie(movie:Movie,type:string) {
    this.movieDetails = movie;
    this.movieType =type;
    console.log(this.movieDetails,type)
  }
  updateMovie()
  {
    const updateUrl = `http://localhost:3000/movies/${this.movieType}/${this.movieDetails.id}`;
    this.http.put(updateUrl, this.movieDetails).subscribe(
      (response) => {
        alert("Movie Updated Sucessfully")
        window.location.reload();
      },
      (error) => {
        console.error("Error submitting review:", error);
      }
    );
  }
  deleteMovie(movieId: number, movieType: string) {
    if (confirm('Are you sure you want to delete this movie?')) {
      this.http.delete(`http://localhost:3000/movies/${movieType}/${movieId}`).subscribe(
        () => {
          this.popularMovies = this.popularMovies.filter((movie: Movie) => movie.id !== movieId);
          alert('Movie deleted successfully');
        },
        error => {
          console.error('Error deleting movie:', error);
          alert('Error deleting movie');
        }
      );
    }
  }
  editUser(user : User)
  {
    this.userDetails = user;
    console.log(user)
  }
  updateUser()
  {
    this.registerService.updateUser(this.userDetails.username,this.userDetails).subscribe(()=>
    {
      alert("User Updated Sucessfully")
      window.location.reload();
    },
    error=>
      {
        console.error('Error Updating User:', error);
        alert('Error Updating User');
      }
  );
}
deleteUser(username: string) {
  if (confirm('Are you sure you want to delete this user?')) {
    this.http.delete(`http://localhost:3000/users/${username}`).subscribe(
      () => {
        this.allUsers = this.allUsers.filter((user: User) => user.username !== username);
        alert('User deleted successfully');
        window.location.reload();
      },
      (error) => {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    );
  }
}
}
