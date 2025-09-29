import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-owner-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './owner-layout.component.html',
  styleUrl: './owner-layout.component.css',
})
export class OwnerLayoutComponent implements OnInit {
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
