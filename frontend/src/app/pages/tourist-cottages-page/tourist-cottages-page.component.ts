import { Component } from '@angular/core';
import { CottageSearchComponent } from '../../components/cottage-search/cottage-search.component';

@Component({
  selector: 'app-tourist-cottages-page',
  standalone: true,
  imports: [CottageSearchComponent],
  templateUrl: './tourist-cottages-page.component.html',
  styleUrl: './tourist-cottages-page.component.css',
})
export class TouristCottagesPageComponent {}
