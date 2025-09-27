import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private userService = inject(UserService);

  error: string = ' ';
  cc_type = -1;
  user = new User();
  ponovljena_lozinka: string = '';
  private router = inject(Router);

  profilna_slika =
    'http://localhost:4000/uploads/db456e9f5c052f23662e691ba4d4ed32';

  validatePassword() {
    let { ok, reason } = this.userService.validatePassword(this.user.lozinka);
    this.error = reason;
  }
  //  enctype="multipart/form-data" method="POST" action="http://localhost:4000/korisnici/register"

  selectedFile: File | null = null;

  allowedTypes = ['image/jpeg', 'image/png']; // dozvoljeni formati
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      // provera tipa fajla
      if (!this.allowedTypes.includes(file.type)) {
        this.error = 'Allowed formats: JPG i PNG';
        this.selectedFile = null;
        return;
      }

      this.error = '';
      this.selectedFile = file;
    }
  }
  images: string[] = [
    'cards/diners.png',
    'cards/mastercard.png',
    'cards/visa.png',
  ];
  validateCreditCard() {
    this.cc_type = this.userService.validateCreditCard(
      this.user.kreditna_kartica
    );
  }

  clearFile(input: HTMLInputElement) {
    input.value = '';
    this.selectedFile = null;
    this.error = '';
  }
  register(form: NgForm) {
    console.log(this.user);
    if (
      this.user.korisnicko_ime.trim() == '' ||
      this.user.lozinka.trim() == ''
    ) {
      this.error = 'Please fill out all fields.';
      return;
    }
    if (this.ponovljena_lozinka !== this.user.lozinka) {
      this.error = 'Repeated password is not the same.';
      return;
    }
    if (this.cc_type < 0) {
      this.error = 'Invalid credit card number.';
      return;
    }
    if (!form.valid) {
      this.error =
        'Fields are not in required format or required fields are empty.';
      return;
    }

    this.userService
      .register(this.user, this.selectedFile ?? undefined)
      .subscribe((korisnik) => {
        if ('reason' in korisnik) {
          this.error = korisnik.reason;

          return;
        }

        // if (this.selectedFile) {
        //   this.userService
        //     .changeProfilePhoto(this.user.korisnicko_ime, this.selectedFile)
        //     .subscribe((res) => {
        //       this.userService.startSession(korisnik);
        //       this.router.navigate(['/home']);
        //     });
        // } else {
        console.log('res', korisnik);
        this.userService.startSession(korisnik);
        this.router.navigate(['/home']);
      });
  }
}
