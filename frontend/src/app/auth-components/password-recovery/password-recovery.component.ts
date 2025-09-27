import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { __importDefault } from 'tslib';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css',
})
export class PasswordRecoveryComponent implements OnInit {
  private userService = inject(UserService);

  korisnicko_ime: string = '';
  lozinka: string = '';
  stara_lozinka: string = '';
  ponovljena_lozinka: string = '';
  error: string = ' ';

  private router = inject(Router);

  constructor(private route: ActivatedRoute) {}
  validatePassword(stara: boolean) {
    let loz = stara ? this.stara_lozinka : this.lozinka;
    let { ok, reason } = this.userService.validatePassword(loz);
    this.error = reason;
  }
  ngOnInit(): void {
    this.korisnicko_ime =
      this.route.snapshot.paramMap.get('korisnicko_ime') ?? '';
  }
  change(form: NgForm) {
    this.error = '';
    if (this.ponovljena_lozinka !== this.lozinka) {
      this.error = 'Repeated password is not the same.';
      return;
    }

    if (!form.valid) {
      this.error = 'Required fields are empty.';
      return;
    }
    this.userService
      .passwordRecovery(this.lozinka, this.stara_lozinka, this.korisnicko_ime)
      .subscribe((d) => {
        if (!d.ok) {
          this.error = d.reason;
          return;
        }
        this.router.navigate(['/login']);
      });
  }
}
