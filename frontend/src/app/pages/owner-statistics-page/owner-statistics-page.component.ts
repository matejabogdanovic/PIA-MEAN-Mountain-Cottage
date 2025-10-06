import { Component, inject, OnInit } from '@angular/core';
import { OwnerLayoutComponent } from '../../layouts/owner-layout/owner-layout.component';
import { Router } from '@angular/router';
import { ReservationPopulated } from '../../models/Reservation';
import { User } from '../../models/User';
import { ReservationService } from '../../services/reservation.service';
import { UserService } from '../../services/user.service';
import { CottageService } from '../../services/cottage.service';
import { Cottage } from '../../models/Cottage';

import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';
import { PieChartComponent } from '../../components/pie-chart/pie-chart.component';

@Component({
  selector: 'app-owner-statistics-page',
  standalone: true,
  imports: [OwnerLayoutComponent, BarChartComponent, PieChartComponent],
  templateUrl: './owner-statistics-page.component.html',
  styleUrl: './owner-statistics-page.component.css',
})
export class OwnerStatisticsPageComponent implements OnInit {
  user: User = new User();
  private userService = inject(UserService);
  private resService = inject(ReservationService);
  private cotService = inject(CottageService);
  private router = inject(Router);
  loading = true;

  rezervacije: ReservationPopulated[] = [];

  rezervacijeOstvarene: ReservationPopulated[] = [];
  cottages: Cottage[] = [];

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

        this.rezervacije.sort(
          (a, b) => new Date(b.od).getTime() - new Date(a.od).getTime()
        );

        this.rezervacijeOstvarene = this.rezervacije.filter(
          (r) => new Date(r.do) < new Date() && r.prihvacena == true
        );

        this.cotService
          .getAllCottagesUsername(x.korisnicko_ime)
          .subscribe((d) => {
            // debug console.log(d);
            this.cottages = d;

            this.loading = false;
          });
      });
    });
  }

  filterOstvarene(r: Cottage) {
    return this.rezervacijeOstvarene.filter((d) => d.cottage_id._id == r._id);
  }
}
