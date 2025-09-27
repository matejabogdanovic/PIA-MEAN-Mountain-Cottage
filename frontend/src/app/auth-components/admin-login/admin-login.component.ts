import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {
  private userService = inject(UserService);

  korisnicko_ime: string = '';
  lozinka: string = '';
  error: string = ' ';

  private router = inject(Router);
  showChangePassword = false;
  usernameInput() {
    if (this.korisnicko_ime.trim() != '') {
      this.showChangePassword = true;
    } else {
      this.showChangePassword = false;
    }
  }

  changePassword() {
    this.router.navigate([`/password-change/${this.korisnicko_ime}`]);
  }
  login() {
    if (this.korisnicko_ime == '' || this.lozinka == '') {
      this.error = 'Please fill out all fields.';
      return;
    }
    this.userService
      .loginAdmin(this.korisnicko_ime, this.lozinka)
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
