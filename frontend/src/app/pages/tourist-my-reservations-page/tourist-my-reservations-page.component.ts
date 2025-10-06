import { Component, inject, OnInit } from '@angular/core';
import { TouristLayoutComponent } from '../../layouts/tourist-layout/tourist-layout.component';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { ReservationService } from '../../services/reservation.service';
import { Reservation, ReservationPopulated } from '../../models/Reservation';
import { ReservationListingComponent } from '../../components/reservation-listing/reservation-listing.component';
import { StarsComponent } from '../../components/stars/stars.component';
import { RatingStarsComponent } from '../../components/rating-stars/rating-stars.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tourist-my-reservations-page',
  standalone: true,
  imports: [
    TouristLayoutComponent,
    ReservationListingComponent,
    StarsComponent,
    RatingStarsComponent,
    FormsModule,
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
      // debug console.log(this.user._id);
      this.resService.getMyReservations(this.user._id).subscribe((d) => {
        // debug console.log(d);
        this.rezervacije = d;
        for (let i = 0; i < d.length; i++) {
          this.rezervacije[i].nov_komentar = '';
          this.rezervacije[i].nova_ocena = 0;
        }
        const danas = new Date();
        this.rezervacije.sort((a, b) => {
          const diffA = Math.abs(new Date(a.od).getTime() - danas.getTime());
          const diffB = Math.abs(new Date(b.od).getTime() - danas.getTime());
          return diffA - diffB;
        });
        // this.rezervacije.sort(
        //   (a, b) => new Date(b.od).getTime() - new Date(a.od).getTime()
        // );
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

  cancel(r: ReservationPopulated) {
    this.resService
      .cancelReservation(r._id, r.cottage_id._id, r.od)
      .subscribe((d) => {
        if (d.ok) {
          this.ngOnInit();
          return;
        }
        r.error = d.reason;
      });
  }
  submitReview(event: Event, r: ReservationPopulated) {
    event.preventDefault();
    if (r.nova_ocena == 0) {
      r.error = 'Please, leave a rating.';
      return;
    }
    if (r.nov_komentar.trim() == '') {
      r.error = 'Please, leave a review.';
      return;
    }
    this.resService
      .submitReview(r._id, r.nova_ocena, r.nov_komentar)
      .subscribe((d) => {
        // debug console.log(d);
        if (d.ok) {
          this.ngOnInit();
        } else {
          // this.error = d.reason;
          r.error = d.reason;
        }
      });
  }
}
