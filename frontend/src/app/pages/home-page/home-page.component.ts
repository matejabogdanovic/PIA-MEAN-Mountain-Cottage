import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { AdminHomePageComponent } from '../admin-home-page/admin-home-page.component';
import { TouristPageComponent } from '../tourist-page/tourist-page.component';
import { OwnerPageComponent } from '../owner-page/owner-page.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [AdminHomePageComponent, TouristPageComponent, OwnerPageComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  user: User = new User();
  private userService = inject(UserService);

  private router = inject(Router);

  logout() {
    this.userService.endSession();
    this.router.navigate(['/login']);
  }
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
