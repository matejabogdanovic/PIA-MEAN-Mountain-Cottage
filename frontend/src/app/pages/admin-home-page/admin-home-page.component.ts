import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models/User';
import { UserListingComponent } from '../../components/user-listing/user-listing.component';
import { ProfileComponent } from '../../components/profile/profile.component';

@Component({
  selector: 'app-admin-home-page',
  standalone: true,
  imports: [UserListingComponent, ProfileComponent],
  templateUrl: './admin-home-page.component.html',
  styleUrl: './admin-home-page.component.css',
})
export class AdminHomePageComponent implements OnInit {
  private userService = inject(UserService);
  private adminService = inject(AdminService);
  private router = inject(Router);

  korisnici: User[] = [];
  vlasnici: User[] = [];
  turisti: User[] = [];
  zahtevi: User[] = [];
  blokirani: User[] = [];
  error = '';

  edit_opened = false;
  ngOnInit(): void {
    this.adminService.getAllUsers().subscribe((d) => {
      if (!d) {
        this.error = 'Internal error.';
      }
      this.korisnici = d;
      console.log(this.korisnici);
      this.vlasnici = this.korisnici.filter(
        (u) => u.tip == 'vlasnik' && u.aktivan == true
      );
      this.turisti = this.korisnici.filter(
        (u) => u.tip == 'turista' && u.aktivan == true
      );
      this.blokirani = this.korisnici.filter((u) => u.blokiran == true);
      this.zahtevi = this.korisnici.filter(
        (u) => u.aktivan == false && u.blokiran == false
      );
    });
  }
  logout() {
    this.userService.endSession();
    this.router.navigate(['']);
  }

  editing_user = '';
  editingUserStart(korisnicko_ime: string) {
    this.editing_user = korisnicko_ime;
    this.edit_opened = true;
  }
  edit(korisnik: User) {}
  delete(korisnik: User) {}
  changeActiveStatus(korisnicko_ime: string, status: boolean) {
    this.adminService
      .changeActiveStatus(korisnicko_ime, status)
      .subscribe((d) => {
        this.ngOnInit();
      });
  }
}
