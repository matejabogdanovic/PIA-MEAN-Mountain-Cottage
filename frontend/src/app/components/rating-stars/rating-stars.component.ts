import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [NgFor],
  templateUrl: './rating-stars.component.html',
  styleUrl: './rating-stars.component.css',
})
export class RatingStarsComponent {
  @Input() rating!: number;
  @Output() ratingChange = new EventEmitter<number>();
  maxStars = 5;
  stars = Array(5);
  filledStars() {
    return new Array(this.rating);
  }

  emptyStars() {
    return new Array(this.maxStars - this.rating);
  }
  setRating(value: number) {
    this.rating = value;
    this.ratingChange.emit(this.rating);
  }
}
