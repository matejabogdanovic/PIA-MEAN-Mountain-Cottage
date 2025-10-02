import { Component, Input, OnInit } from '@angular/core';
import { Cottage } from '../../models/Cottage';
import { FormsModule } from '@angular/forms';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-cottage',
  standalone: true,
  imports: [FormsModule, NgClass, NgStyle],
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
    this.currentPhotoSrc = `${this.slikaApi}/${
      this.cottage.slike[this.currentPhoto]
    }`;
    this.month = danas.getMonth();
    console.log(this.cottage);
  }
  currentPhoto = 0;
  currentPhotoSrc = '';

  gallery(move: number) {
    this.currentPhoto =
      (this.currentPhoto + move + this.cottage.slike.length) %
      this.cottage.slike.length;

    this.currentPhotoSrc = `${this.slikaApi}/${
      this.cottage.slike[this.currentPhoto]
    }`;
  }
  showGalleryOverlay: boolean = false;
  showPhoto() {
    this.showGalleryOverlay = true;
  }
  hidePhoto() {
    this.showGalleryOverlay = false;
  }
}
