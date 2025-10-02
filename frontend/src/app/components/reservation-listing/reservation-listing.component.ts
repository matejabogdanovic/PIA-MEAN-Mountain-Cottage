import { Component, Input } from '@angular/core';
import { ReservationPopulated } from '../../models/Reservation';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reservation-listing',
  standalone: true,
  imports: [CommonModule, NgClass, RouterLink],
  templateUrl: './reservation-listing.component.html',
  styleUrl: './reservation-listing.component.css',
})
export class ReservationListingComponent {
  slikeApi = 'http://192.168.0.31:4000/uploads/';
  @Input() rezervacija!: ReservationPopulated;
  @Input() isOwner: boolean = false;
}
