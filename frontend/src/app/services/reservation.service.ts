import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Reservation, ReservationPopulated } from '../models/Reservation';
import { Cottage } from '../models/Cottage';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  constructor() {}

  private http = inject(HttpClient);
  private api = 'http://192.168.0.31:4000/rezervacije';

  book(
    from: Date,
    to: Date,
    cottage_id: string,
    user_id: string,
    total: number,
    note: string
  ) {
    return this.http.post<{ ok: boolean; reason: string }>(`${this.api}/book`, {
      od: from,
      do: to,
      cottage_id,
      user_id,
      total,
      napomena: note,
    });
  }

  getAllReservations() {
    return this.http.get<Reservation[]>(`${this.api}/getAllReservations`);
  }
  getMyReservations(user_id: string) {
    return this.http.post<ReservationPopulated[]>(
      `${this.api}/getMyReservations`,
      {
        user_id,
      }
    );
  }
  getMyReservationsOwner(user_id: string) {
    return this.http.post<ReservationPopulated[]>(
      `${this.api}/getMyReservationsOwner`,
      {
        user_id,
      }
    );
  }
  submitReview(_id: string, ocena: number, komentar: string) {
    return this.http.post<{ ok: boolean; reason: string }>(
      `${this.api}/submitReview`,
      {
        _id,
        ocena,
        komentar,
      }
    );
  }
  acceptReservation(_id: string, prihvacena: boolean, odbijenica: string) {
    return this.http.post<{ ok: boolean; reason: string }>(
      `${this.api}/acceptReservation`,
      {
        _id,
        prihvacena,
        odbijenica,
      }
    );
  }

  getTakenDates(_id: string) {
    return this.http.post<{ od: string; do: string }[]>(
      `${this.api}/getTakenDates`,
      {
        _id,
      }
    );
  }
}
