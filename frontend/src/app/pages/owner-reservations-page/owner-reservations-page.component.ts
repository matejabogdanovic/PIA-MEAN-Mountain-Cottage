import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationPopulated } from '../../models/Reservation';
import { User } from '../../models/User';
import { ReservationService } from '../../services/reservation.service';
import { UserService } from '../../services/user.service';
import { OwnerLayoutComponent } from '../../layouts/owner-layout/owner-layout.component';
import { ReservationListingComponent } from '../../components/reservation-listing/reservation-listing.component';
import { StarsComponent } from '../../components/stars/stars.component';
import { FormsModule } from '@angular/forms';
// kalendar
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
@Component({
  selector: 'app-owner-reservations-page',
  standalone: true,
  imports: [
    OwnerLayoutComponent,
    ReservationListingComponent,
    StarsComponent,
    FormsModule,
    FullCalendarModule,
  ],
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

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    height: '80dvh',

    events: [],
    eventClick: (info) => {
      if (info.event.extendedProps['prihvacena'] === false) {
        // debug console.log(info.event.extendedProps);
        let _id = info.event.extendedProps['_id'];
        let el = this.rezervacijeNepotvrdjene.find((d) => d._id == _id);
        if (el) {
          el.modalShown = true;
        }
      }
    },
    eventDidMount: (info) => {
      if (info.event.extendedProps['prihvacena'] === false) {
        info.el.style.cursor = 'pointer';
      } else {
        info.el.style.cursor = 'default';
      }
    },
  };

  loadReservations() {
    let lista = this.rezervacije.filter((a) => a.odbijenica === '');
    const events = lista.map((r) => ({
      title: `${r.cottage_id.naziv}`,
      start: r.od,
      end: r.do,
      extendedProps: r,

      backgroundColor:
        r.prihvacena === false
          ? '#f6bf26'
          : new Date(r.do) > new Date()
          ? '#32b778'
          : '#a1a1a1',
      borderColor:
        r.prihvacena === false
          ? '#f6bf26'
          : new Date(r.do) > new Date()
          ? '#32b778'
          : '#a1a1a1',
    }));

    // ažuriraj kalendar
    this.calendarOptions = {
      ...this.calendarOptions,
      events,
    };
  }
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

      this.resService.getMyReservationsOwner(this.user._id).subscribe((d) => {
        // debug console.log(d);
        this.rezervacije = d;

        this.loadReservations();
        this.rezervacije.sort(
          (a, b) => new Date(b.od).getTime() - new Date(a.od).getTime()
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
        this.loading = false;
      });
    });
  }
  error = '';
  acceptReservation(
    inputOdbijenica: HTMLInputElement,
    accept: boolean,
    r: ReservationPopulated
  ) {
    // debug console.log(inputOdbijenica);
    let text = inputOdbijenica.value;
    if (accept == false && text.trim() === '') {
      r.error = 'Please, enter reason for denial.';
      return;
    }
    if (accept == true) {
      text = '';
    }
    this.resService.acceptReservation(r._id, accept, text).subscribe((d) => {
      if (d.ok) {
        this.ngOnInit();
      } else {
        r.error = d.reason;
      }
    });
  }
}
