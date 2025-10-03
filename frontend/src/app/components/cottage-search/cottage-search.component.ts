import { Component, inject, Input, OnInit } from '@angular/core';
import { CottageListingComponent } from '../cottage-listing/cottage-listing.component';
import { Cottage } from '../../models/Cottage';
import { User } from '../../models/User';
import { CottageService } from '../../services/cottage.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StarsComponent } from '../stars/stars.component';
@Component({
  selector: 'app-cottage-search',
  standalone: true,
  imports: [
    CottageListingComponent,
    CottageListingComponent,
    FormsModule,
    StarsComponent,
  ],
  templateUrl: './cottage-search.component.html',
  styleUrl: './cottage-search.component.css',
})
export class CottageSearchComponent implements OnInit {
  private cotService = inject(CottageService);
  private userService = inject(UserService);
  private router = inject(Router);
  // user: User = new User();
  cottages: Cottage[] = [];
  error = '';
  loading = true;
  filteredCottages: Cottage[] = [];
  @Input() registered: boolean = true;
  @Input() isAdmin: boolean = false;
  ngOnInit(): void {
    this.loading = true;
    // let x = this.userService.getUser();
    // if (!x) return;
    // this.user = x;

    this.cotService.getAllCottages().subscribe((d) => {
      console.log(d);
      this.cottages = d;
      this.filteredCottages = d;
      this.loading = false;
    });
  }

  navigate(c: Cottage) {
    this.router.navigate([`/cottage/${c._id}`]);
  }

  name_query = '';
  location_query = '';
  po_nazivu = '';
  queryChange() {
    if (this.name_query.trim() === '' && this.location_query.trim() === '') {
      this.filteredCottages = this.cottages;
      return;
    }
    this.filteredCottages = this.cottages.filter((c) => {
      const matchName = this.name_query
        ? c.naziv.toLowerCase().includes(this.name_query.toLowerCase())
        : false;

      const matchLocation = this.location_query
        ? c.mesto.toLowerCase().includes(this.location_query.toLowerCase())
        : false;

      return matchName || matchLocation;
    });

    this.order();
  }
  mestodir = 0;
  nazivdir = 0;
  changed = 0;
  clearFilters() {
    this.changed = 0;

    this.mestodir = 0;
    this.nazivdir = 0;
    this.filteredCottages = this.cottages;
  }
  order() {
    this.filteredCottages.sort((d1, d2) => {
      if (this.changed == 1) {
        // poredi po mestu
        if (this.mestodir !== 0) {
          const cmpMesto =
            d1.mesto.toLowerCase().localeCompare(d2.mesto.toLowerCase()) *
            this.mestodir;
          if (cmpMesto !== 0) return cmpMesto;
        }
        // poredi po nazivu
        if (this.nazivdir !== 0) {
          const cmpNaziv =
            d1.naziv.toLowerCase().localeCompare(d2.naziv.toLowerCase()) *
            this.nazivdir;
          if (cmpNaziv !== 0) return cmpNaziv;
        }

        return 0;
      } else {
        // poredi po nazivu
        if (this.nazivdir !== 0) {
          const cmpNaziv =
            d1.naziv.toLowerCase().localeCompare(d2.naziv.toLowerCase()) *
            this.nazivdir;
          if (cmpNaziv !== 0) return cmpNaziv;
        }
        // poredi po mestu
        if (this.mestodir !== 0) {
          const cmpMesto =
            d1.mesto.toLowerCase().localeCompare(d2.mesto.toLowerCase()) *
            this.mestodir;
          if (cmpMesto !== 0) return cmpMesto;
        }
        return 0; // ako su i naziv i mesto isti
      }
    });
  }
  orderPoMestu(dir: number) {
    this.changed = 1;
    console.log(dir);
    this.mestodir = dir;
    this.order();
  }
  orderPoNazivu(dir: number) {
    this.changed = 2;
    console.log(dir);
    this.nazivdir = dir;
    this.order();
  }
}
