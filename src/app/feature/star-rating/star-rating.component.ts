import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [NgbRatingModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss'
})
export class StarRatingComponent {
  @Input() rating:any;
  @Input() isReadOnly:boolean =false;
  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();

  onRateChange(newRating: number): void {
    if (!this.isReadOnly) {
      this.rating = newRating;
      this.ratingChange.emit(this.rating);
    }
  }

}
