import { Component, inject, Input, OnInit } from '@angular/core';
import { Cottage } from '../../models/Cottage';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass, NgStyle } from '@angular/common';
import { StarsComponent } from '../stars/stars.component';
import { CottageService } from '../../services/cottage.service';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
@Component({
  selector: 'app-cottage',
  standalone: true,
  imports: [FormsModule, NgClass, NgStyle, StarsComponent, CommonModule],
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
  private cotService = inject(CottageService);
  komentari: {
    komentar_i_ocena: { komentar: string; ocena: number };
    updatedAtDate: Date;
  }[] = [];
  api: SafeResourceUrl = '';
  constructor(private sanitizer: DomSanitizer) {}
  ngOnInit(): void {
    const danas = new Date();
    this.currentPhotoSrc = `${this.slikaApi}/${
      this.cottage.slike[this.currentPhoto]
    }`;
    this.month = danas.getMonth();
    let url = `https://maps.google.com/maps?width=600&height=400&hl=en&q=${this.cottage.koordinate.lat.toString()},${this.cottage.koordinate.lng.toString()}&t=&z=14&ie=UTF8&iwloc=B&output=embed`;

    this.api = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    this.cotService.getReviews(this.cottage._id).subscribe((d) => {
      console.log(d);

      this.komentari = d.map((kom) => {
        return {
          ...kom,
          updatedAtDate: new Date(kom.updatedAt),
        };
      });
    });
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
