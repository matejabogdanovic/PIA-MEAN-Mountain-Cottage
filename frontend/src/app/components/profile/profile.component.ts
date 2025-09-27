import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  @Input() user!: User;
  @Input() isAdmin: boolean = false;
  private userService = inject(UserService);

  private router = inject(Router);
  slikaApi = 'http://localhost:4000/uploads';
  error: string = ' ';

  @Input() edit = false;
  // Event koji šalje promene roditelju
  @Output() editChange = new EventEmitter<boolean>();
  loading = true;
  ngOnInit(): void {
    this.loading = true;
    console.log('refresh');
    // let x = this.userService.getUser();

    // if (x == null) return;

    this.userService.getOneUser(this.user.korisnicko_ime).subscribe((d) => {
      if (!d) return;

      this.user = d;
      console.log(this.user);

      const timestamp = new Date().getTime();
      this.user.profilna_slika = `${this.slikaApi}/${d.profilna_slika}?t=${timestamp}`;
      this.loading = false;
    });
  }
  images: string[] = [
    'cards/diners.png',
    'cards/mastercard.png',
    'cards/visa.png',
  ];
  cc_type = -1;
  validateCreditCard() {
    this.cc_type = this.userService.validateCreditCard(
      this.user.kreditna_kartica
    );
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
  changeEdit(nedit: boolean) {
    this.edit = nedit;
    this.editChange.emit(nedit);
  }

  clearFile(input: HTMLInputElement) {
    input.value = '';
    this.selectedFile = null;
    this.error = '';
  }

  cancel() {
    // this.edit = false;
    this.changeEdit(false);
    this.selectedFile = null;
    this.error = '';
    this.cc_type = -1;
    this.ngOnInit();
  }
  submit(form: NgForm) {
    console.log(this.user);
    if (!form.valid) {
      this.error =
        'Fields are not in required format or required fields are empty.';
      return;
    }

    this.userService.changeUserData(this.user).subscribe((d) => {
      if (d.ok == false) {
        this.error = d.reason;
      } else {
        if (this.selectedFile) {
          this.userService
            .changeProfilePhoto(this.user.korisnicko_ime, this.selectedFile)
            .subscribe((d) => {
              if (d.ok == false) {
                this.error = d.reason;
              } else {
                this.cancel();
              }
            });
        } else {
          this.cancel();
        }
      }
    });
  }
}
