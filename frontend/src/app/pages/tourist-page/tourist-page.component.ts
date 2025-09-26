import { Component } from '@angular/core';
import { ProfileComponent } from '../../components/profile/profile.component';

@Component({
  selector: 'app-tourist-page',
  standalone: true,
  imports: [ProfileComponent],
  templateUrl: './tourist-page.component.html',
  styleUrl: './tourist-page.component.css',
})
export class TouristPageComponent {}
