import { Component, inject, Input } from '@angular/core';
import { ProfileComponent } from '../../components/profile/profile.component';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-tourist-page',
  standalone: true,
  imports: [ProfileComponent],
  templateUrl: './tourist-page.component.html',
  styleUrl: './tourist-page.component.css',
})
export class TouristPageComponent {
  @Input() user!: User;
  private userService = inject(UserService);

  private router = inject(Router);

  logout() {
    this.userService.endSession();
    this.router.navigate(['/login']);
  }
}
