import { Component } from '@angular/core';
import { CottageSearchComponent } from '../../components/cottage-search/cottage-search.component';
import { TouristLayoutComponent } from '../../layouts/tourist-layout/tourist-layout.component';

@Component({
  selector: 'app-tourist-cottages-page',
  standalone: true,
  imports: [CottageSearchComponent, TouristLayoutComponent],
  templateUrl: './tourist-cottages-page.component.html',
  styleUrl: './tourist-cottages-page.component.css',
})
export class TouristCottagesPageComponent {}
