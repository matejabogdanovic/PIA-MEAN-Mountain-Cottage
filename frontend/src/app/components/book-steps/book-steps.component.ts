import { Component, inject, Input, OnInit } from '@angular/core';
import { Cottage } from '../../models/Cottage';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule, NgClass } from '@angular/common';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../models/Reservation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-steps',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgClass,
  ],
  templateUrl: './book-steps.component.html',
  styleUrl: './book-steps.component.css',
})
export class BookStepsComponent implements OnInit {
  @Input() cottage!: Cottage;
  step: number = 1;

  dateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    this.checkin =
      dateRangeStart.value == '' ? null : new Date(dateRangeStart.value);
    this.checkout =
      dateRangeEnd.value == '' ? null : new Date(dateRangeEnd.value);
    if (this.checkin) {
      this.checkin.setHours(14, 0, 0, 0);
    }
    if (this.checkout) {
      this.checkout.setHours(10, 0, 0, 0);
    }
    console.log(this.checkin);
    console.log(this.checkout);
  }

  checkin: Date | null = null;
  checkout: Date | null = null;
  persons = 0;
  children = 0;
  total = 0;

  note = '';
  error = '';
  user: User = new User();
  private userService = inject(UserService);
  private resService = inject(ReservationService);

  ngOnInit(): void {
    let x = this.userService.getUser();
    if (!x) return;
    this.user = x;
    this.cc_type = this.userService.validateCreditCard(
      this.user.kreditna_kartica
    );

    this.resService.getAllReservations().subscribe((d) => {
      console.log(d);
    });
  }
  reservedRanges: { start: Date; end: Date }[] = [];

  // todo
  constructor() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(tomorrow.getDate() + 1);

    const threeDaysLater = new Date(tomorrow);
    threeDaysLater.setDate(tomorrow.getDate() + 2);

    const fourDaysLater = new Date(tomorrow);
    fourDaysLater.setDate(tomorrow.getDate() + 3);

    // 2 range-a
    this.reservedRanges = [
      { start: today, end: today }, // sutra i prekosutra
      { start: threeDaysLater, end: fourDaysLater }, // +2 i +3 dana
    ];
  }
  myDateFilter = (d: Date | null): boolean => {
    if (!d) return false;

    const date = new Date(d);
    date.setHours(0, 0, 0, 0);

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    minDate.setHours(0, 0, 0, 0);

    // datum je dozvoljen samo ako je >= sutra i ne upada u rezervisane range-ove
    const isInReservedRange = this.reservedRanges.some(
      (range) =>
        date.getTime() >= range.start.getTime() &&
        date.getTime() <= range.end.getTime()
    );

    return date.getTime() >= minDate.getTime() && !isInReservedRange;
  };
  images: string[] = [
    'cards/diners.png',
    'cards/mastercard.png',
    'cards/visa.png',
  ];
  cc_type = -1;
  validateCreditCard() {
    this.cc_type = this.userService.validateCreditCard(
      this.user.kreditna_kartica
    );
  }

  calculateTotalPrice(
    start: Date | null,
    end: Date | null,
    prices: number[]
  ): number {
    if (!start || !end || prices.length !== 12) return 0;

    // resetuj vreme da racunica bude po danima
    const startCopy = new Date(start);
    startCopy.setHours(0, 0, 0, 0);

    const endCopy = new Date(end);
    endCopy.setHours(0, 0, 0, 0);

    if (endCopy <= startCopy) return 0;

    let total = 0;
    const current = new Date(startCopy);

    while (current < endCopy) {
      const monthIndex = current.getMonth(); // 0-11
      total += prices[monthIndex];
      current.setDate(current.getDate() + 1);
    }

    return total;
  }
  next() {
    this.error = '';
    if (this.persons == 0) {
      this.error = 'At least one person needed.';
      return;
    }
    if (this.persons < 0 || this.children < 0) {
      this.error = 'Invalid number of people.';
      return;
    }
    if (this.checkin == null || this.checkout == null) {
      this.error = 'Select check in and check out date.';
      return;
    }

    this.total = this.calculateTotalPrice(
      this.checkin,
      this.checkout,
      this.cottage.cenovnik
    );
    this.step = 2;
  }
  back() {
    this.step = 1;
  }

  private router = inject(Router);
  success = false;
  finish() {
    if (!this.checkin || !this.checkout) {
      this.error = 'Invalid date.';
      return;
    }
    if (this.cc_type < 0) {
      this.error = 'Invalid credit card number.';
      return;
    }

    this.resService
      .book(
        this.checkin,
        this.checkout,
        this.cottage._id,
        this.user._id,
        this.total,
        this.note
      )
      .subscribe((d) => {
        console.log(d);
        if (d.ok) {
          this.success = true;
        } else {
          this.error = d.reason;
        }
      });
  }
}
