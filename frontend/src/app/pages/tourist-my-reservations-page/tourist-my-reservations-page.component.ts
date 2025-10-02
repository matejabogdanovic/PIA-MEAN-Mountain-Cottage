import { Component, inject, OnInit } from '@angular/core';
import { TouristLayoutComponent } from '../../layouts/tourist-layout/tourist-layout.component';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { ReservationService } from '../../services/reservation.service';
import { Reservation, ReservationPopulated } from '../../models/Reservation';
import { ReservationListingComponent } from '../../components/reservation-listing/reservation-listing.component';
import { StarsComponent } from '../../components/stars/stars.component';

@Component({
  selector: 'app-tourist-my-reservations-page',
  standalone: true,
  imports: [
    TouristLayoutComponent,
    ReservationListingComponent,
    StarsComponent,
  ],
  templateUrl: './tourist-my-reservations-page.component.html',
  styleUrl: './tourist-my-reservations-page.component.css',
})
export class TouristMyReservationsPageComponent implements OnInit {
  user: User = new User();
  private userService = inject(UserService);
  private resService = inject(ReservationService);

  private router = inject(Router);
  loading = true;
  rezervacije: ReservationPopulated[] = [];
  rezervacijeAktivne: ReservationPopulated[] = [];
  rezervacijeNepotvrdjene: ReservationPopulated[] = [];
  rezervacijeIstekle: ReservationPopulated[] = [];
  ngOnInit(): void {
    this.loading = true;
    let x = this.userService.getUser();
    if (x == null) {
      this.router.navigate(['']);
      return;
    }
    this.userService.getOneUser(x.korisnicko_ime).subscribe((d) => {
      if (!d) return;
      this.user = d;
      console.log(this.user._id);
      this.resService.getMyReservations(this.user._id).subscribe((d) => {
        console.log(d);
        this.rezervacije = d;
        this.rezervacije.sort(
          (a, b) => new Date(a.od).getTime() - new Date(b.od).getTime()
        );
        this.rezervacijeAktivne = this.rezervacije.filter(
          (r) => new Date(r.do) >= new Date() && r.prihvacena == true
        );
        this.rezervacijeIstekle = this.rezervacije.filter(
          (r) =>
            (new Date(r.do) < new Date() && r.prihvacena == true) ||
            (r.prihvacena == false && r.odbijenica !== '')
        );
        this.rezervacijeNepotvrdjene = this.rezervacije.filter(
          (r) => r.prihvacena == false && r.odbijenica == ''
        );
      });
      this.loading = false;
    });
  }
}
