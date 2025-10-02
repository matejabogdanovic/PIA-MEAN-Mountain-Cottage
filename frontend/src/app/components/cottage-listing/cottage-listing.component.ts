import { Component, Input, OnInit } from '@angular/core';
import { Cottage } from '../../models/Cottage';

@Component({
  selector: 'app-cottage-listing',
  standalone: true,
  imports: [],
  templateUrl: './cottage-listing.component.html',
  styleUrl: './cottage-listing.component.css',
})
export class CottageListingComponent implements OnInit {
  slikaApi = 'http://localhost:4000/uploads';
  @Input() cottage!: Cottage;
  profilna_slika = '';
  loading = true;
  month = 0;
  ngOnInit(): void {
    this.loading = true;
    const danas = new Date();
    const timestamp = danas.getTime();

    this.month = danas.getMonth();
    this.profilna_slika = `${this.slikaApi}/${this.cottage.slike[0]}`;
    this.loading = false;
  }
}
