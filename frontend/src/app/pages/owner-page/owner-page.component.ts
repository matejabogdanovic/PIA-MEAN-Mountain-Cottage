import { Component, inject, Input } from '@angular/core';
import { ProfileComponent } from '../../components/profile/profile.component';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-owner-page',
  standalone: true,
  imports: [ProfileComponent, RouterLink],
  templateUrl: './owner-page.component.html',
  styleUrl: './owner-page.component.css',
})
export class OwnerPageComponent {
  @Input() user!: User;
  private userService = inject(UserService);

  private router = inject(Router);

  logout() {
    this.userService.endSession();
    this.router.navigate(['/login']);
  }
}
