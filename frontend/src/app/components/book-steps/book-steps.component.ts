import { Component, Input, OnInit } from '@angular/core';
import { Cottage } from '../../models/Cottage';

@Component({
  selector: 'app-book-steps',
  standalone: true,
  imports: [],
  templateUrl: './book-steps.component.html',
  styleUrl: './book-steps.component.css',
})
export class BookStepsComponent implements OnInit {
  @Input() cottage!: Cottage;
  step: number = 2;

  ngOnInit(): void {}

  next() {
    this.step = 2;
  }
  back() {
    this.step = 1;
  }
  finish() {}
}
