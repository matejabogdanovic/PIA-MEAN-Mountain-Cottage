import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationPopulated } from '../../models/Reservation';
import { User } from '../../models/User';
import { ReservationService } from '../../services/reservation.service';
import { UserService } from '../../services/user.service';
import { OwnerLayoutComponent } from '../../layouts/owner-layout/owner-layout.component';
import { ReservationListingComponent } from '../../components/reservation-listing/reservation-listing.component';
import { StarsComponent } from '../../components/stars/stars.component';

@Component({
  selector: 'app-owner-reservations-page',
  standalone: true,
  imports: [OwnerLayoutComponent, ReservationListingComponent, StarsComponent],
  templateUrl: './owner-reservations-page.component.html',
  styleUrl: './owner-reservations-page.component.css',
})
export class OwnerReservationsPageComponent {
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
      this.resService.getMyReservationsOwner(this.user._id).subscribe((d) => {
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
