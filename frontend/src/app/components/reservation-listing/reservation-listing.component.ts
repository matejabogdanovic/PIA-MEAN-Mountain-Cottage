import { Component, Input } from '@angular/core';
import { ReservationPopulated } from '../../models/Reservation';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-reservation-listing',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './reservation-listing.component.html',
  styleUrl: './reservation-listing.component.css',
})
export class ReservationListingComponent {
  slikeApi = 'http://localhost:4000/uploads/';
  @Input() rezervacija!: ReservationPopulated;
  @Input() isOwner: boolean = false;
}
