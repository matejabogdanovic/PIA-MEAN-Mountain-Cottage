import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { ProfileComponent } from '../../components/profile/profile.component';
import { TouristLayoutComponent } from '../../layouts/tourist-layout/tourist-layout.component';

@Component({
  selector: 'app-tourist-home-page',
  standalone: true,
  imports: [ProfileComponent, TouristLayoutComponent],
  templateUrl: './tourist-home-page.component.html',
  styleUrl: './tourist-home-page.component.css',
})
export class TouristHomePageComponent {
  user: User = new User();
  private userService = inject(UserService);

  private router = inject(Router);
  loading = true;
  ngOnInit(): void {
    this.loading = true;
    let x = this.userService.getUser();
    if (x == null) {
      this.router.navigate(['']);
      return;
    }
    this.userService.getOneUser(x.korisnicko_ime).subscribe((d) => {
      if (!d) return;
      this.user = d;
      this.loading = false;
    });
  }
}
