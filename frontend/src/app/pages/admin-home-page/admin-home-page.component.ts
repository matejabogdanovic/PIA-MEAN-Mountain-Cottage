import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-home-page',
  standalone: true,
  imports: [],
  templateUrl: './admin-home-page.component.html',
  styleUrl: './admin-home-page.component.css',
})
export class AdminHomePageComponent {
  private userService = inject(UserService);
  private adminService = inject(AdminService);
  private router = inject(Router);
  logout() {
    this.userService.endSession();
    this.router.navigate(['']);
  }

  changeActiveStatus() {
    this.adminService.changeActiveStatus('mateja', false).subscribe((d) => {});
  }
}
