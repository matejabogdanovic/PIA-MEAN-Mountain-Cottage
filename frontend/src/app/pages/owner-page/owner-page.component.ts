import { Component } from '@angular/core';
import { ProfileComponent } from '../../components/profile/profile.component';

@Component({
  selector: 'app-owner-page',
  standalone: true,
  imports: [ProfileComponent],
  templateUrl: './owner-page.component.html',
  styleUrl: './owner-page.component.css',
})
export class OwnerPageComponent {}
