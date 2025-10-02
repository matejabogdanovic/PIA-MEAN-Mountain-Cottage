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
    this.step = 1;
    this.error = '';
    this.checkin = null;
    this.checkout = null;
    this.total = 0;
    this.children = 0;
    this.persons = 0;
    this.note = '';
    let x = this.userService.getUser();
    if (!x) return;
    this.user = x;
    this.cc_type = this.userService.validateCreditCard(
      this.user.kreditna_kartica
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2 range-a
    this.reservedRanges = [{ od: today, do: today }];
    this.resService.getTakenDates(this.cottage._id).subscribe((d) => {
      let taken = d.map((dat) => ({
        od: new Date(dat.od),
        do: new Date(dat.do),
      }));
      this.reservedRanges = this.reservedRanges.concat(taken);
      console.log(this.reservedRanges);
    });
  }
  reservedRanges: { od: Date; do: Date }[] = [];
  normalizeDate(d: Date): Date {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  isInReservedRange(date: Date): boolean {
    const normalizedDate = this.normalizeDate(date);

    return this.reservedRanges.some((range) => {
      const start = this.normalizeDate(new Date(range.od));
      const end = this.normalizeDate(new Date(range.do));

      // interval [start, end) => end je slobodan
      return (
        normalizedDate.getTime() >= start.getTime() &&
        normalizedDate.getTime() < end.getTime()
      );
    });
  }
  myDateFilter = (d: Date | null): boolean => {
    if (!d) return false;

    const date = this.normalizeDate(d);

    const minDate = this.normalizeDate(new Date());
    minDate.setDate(minDate.getDate() + 1);

    return date.getTime() >= minDate.getTime() && !this.isInReservedRange(date);
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
  doesRangeOverlap(start: Date, end: Date): boolean {
    const startNorm = this.normalizeDate(start);
    const endNorm = this.normalizeDate(end);

    return this.reservedRanges.some((range) => {
      const rStart = this.normalizeDate(range.od);
      const rEnd = this.normalizeDate(range.do);

      // Ako postoji preklapanje raspona
      return startNorm < rEnd && endNorm > rStart;
    });
  }
  next() {
    this.success = false;
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
    if (this.doesRangeOverlap(this.checkin, this.checkout)) {
      this.error = 'Please select available dates only.';
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
          this.ngOnInit();
        } else {
          this.error = d.reason;
        }
      });
  }
}
