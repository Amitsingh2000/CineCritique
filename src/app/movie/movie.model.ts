export interface Review {
    author: string;
    published_on: string;
    review: string;
    rating: number;
  }
  
  export interface Movie {
    id: number;
    name: string;
    cover: string;
    rating: number;
    reviews: Review[];
  }
  