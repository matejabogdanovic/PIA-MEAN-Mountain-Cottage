import { Component, Input } from '@angular/core';
import { Cottage } from '../../models/Cottage';

@Component({
  selector: 'app-cottage-listing',
  standalone: true,
  imports: [],
  templateUrl: './cottage-listing.component.html',
  styleUrl: './cottage-listing.component.css',
})
export class CottageListingComponent {
  @Input() cottage!: Cottage;
}
