import { Component, inject, Input, OnInit } from '@angular/core';
import { Cottage } from '../../models/Cottage';
import { NgClass } from '@angular/common';
import { CottageService } from '../../services/cottage.service';

@Component({
  selector: 'app-cottage-listing',
  standalone: true,
  imports: [NgClass],
  templateUrl: './cottage-listing.component.html',
  styleUrl: './cottage-listing.component.css',
})
export class CottageListingComponent implements OnInit {
  slikaApi = 'http://localhost:4000/uploads';
  @Input() cottage!: Cottage;
  @Input() isAdmin: boolean = false;
  profilna_slika = '';
  loading = true;
  month = 0;
  private cotService = inject(CottageService);

  stil = '';
  ngOnInit(): void {
    this.loading = true;
    const danas = new Date();
    const timestamp = danas.getTime();

    this.month = danas.getMonth();
    this.profilna_slika = `${this.slikaApi}/${this.cottage.slike[0]}`;

    this.cotService.getReviews(this.cottage._id).subscribe((rev) => {
      let x = rev.slice(0, 3);
      x = x.filter((d) => d.komentar_i_ocena.ocena >= 2);
      console.log(x);

      if (rev.length >= 3 && x.length === 0 && this.isAdmin) {
        this.stil = 'bg-red-300';
      }

      this.loading = false;
    });
  }
}
