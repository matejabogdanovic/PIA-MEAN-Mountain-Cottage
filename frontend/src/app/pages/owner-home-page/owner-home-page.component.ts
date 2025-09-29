import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ProfileComponent } from '../../components/profile/profile.component';

@Component({
  selector: 'app-owner-home-page',
  standalone: true,
  imports: [ProfileComponent],
  templateUrl: './owner-home-page.component.html',
  styleUrl: './owner-home-page.component.css',
})
export class OwnerHomePageComponent implements OnInit {
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
