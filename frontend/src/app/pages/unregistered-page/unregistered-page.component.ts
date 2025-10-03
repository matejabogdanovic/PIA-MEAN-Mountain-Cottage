import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CottageService } from '../../services/cottage.service';
import { Cottage } from '../../models/Cottage';
import { CottageSearchComponent } from '../../components/cottage-search/cottage-search.component';
import { UnregisteredLayoutComponent } from '../../layouts/unregistered-layout/unregistered-layout.component';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-unregistered-page',
  standalone: true,
  imports: [RouterModule, CottageSearchComponent, UnregisteredLayoutComponent],
  templateUrl: './unregistered-page.component.html',
  styleUrl: './unregistered-page.component.css',
})
export class UnregisteredPageComponent implements OnInit {
  private userService = inject(UserService);
  private cotService = inject(CottageService);
  private resService = inject(ReservationService);
  cottages: Cottage[] = [];
  statistics: {
    ukupnoVlasnika: number;
    ukupnoTurista: number;
    ukupnoVikendica: number;
  } = { ukupnoVlasnika: 0, ukupnoTurista: 0, ukupnoVikendica: 0 };

  reservationStatistics: { '24h': number; '7d': number; '30d': number } = {
    '24h': 0,
    '7d': 0,
    '30d': 0,
  };

  ngOnInit(): void {
    this.userService.unregisteredStatistics().subscribe((d) => {
      this.statistics = d;
    });
    this.resService.getReservationStatistics().subscribe((d) => {
      this.reservationStatistics = d;
    });
  }
}
