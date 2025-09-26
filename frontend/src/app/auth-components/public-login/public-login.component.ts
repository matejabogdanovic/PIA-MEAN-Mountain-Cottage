import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-public-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './public-login.component.html',
  styleUrl: './public-login.component.css',
})
export class PublicLoginComponent {
  private userService = inject(UserService);

  korisnicko_ime: string = '';
  lozinka: string = '';
  error: string = ' ';

  private router = inject(Router);
  login() {
    if (this.korisnicko_ime == '' || this.lozinka == '') {
      this.error = 'Please fill out all fields.';
      return;
    }
    this.userService
      .login(this.korisnicko_ime, this.lozinka)
      .subscribe((korisnik) => {
        if (!korisnik) {
          this.error = 'Username or password incorrect.';
          return;
        }

        this.userService.startSession(korisnik);
        this.router.navigate(['/home']);
      });
  }
}
