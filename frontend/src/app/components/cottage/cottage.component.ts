import { Component, Input, OnInit } from '@angular/core';
import { Cottage } from '../../models/Cottage';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { BookStepsComponent } from '../book-steps/book-steps.component';

@Component({
  selector: 'app-cottage',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './cottage.component.html',
  styleUrl: './cottage.component.css',
})
export class CottageComponent implements OnInit {
  @Input() cottage!: Cottage;
  month = 0;
  slikaApi = 'http://localhost:4000/uploads';
  monthNames: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  ngOnInit(): void {
    const danas = new Date();
    const timestamp = danas.getTime();

    this.month = danas.getMonth();
    console.log(this.cottage);
  }
  currentPhoto = 0;

  gallery(move: number) {
    this.currentPhoto =
      (this.currentPhoto + move + this.cottage.slike.length) %
      this.cottage.slike.length;
  }
  showGalleryOverlay: boolean = false;
  showPhoto() {
    this.showGalleryOverlay = true;
  }
  hidePhoto() {
    this.showGalleryOverlay = false;
  }
}
