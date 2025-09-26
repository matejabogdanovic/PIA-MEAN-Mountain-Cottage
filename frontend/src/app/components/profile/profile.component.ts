import { Component, inject, OnInit } from '@angular/core';
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
  user: User = new User();
  private userService = inject(UserService);

  private router = inject(Router);
  slikaApi = 'http://localhost:4000/uploads';
  error: string = ' ';

  edit = false;
  ngOnInit(): void {
    // FETCH FROM BACKEND TODO
    let x = this.userService.getUser();
    if (x == null) return;
    this.user = x;
    console.log(this.user.profilna_slika);
    this.user.profilna_slika = `${this.slikaApi}/${this.user.profilna_slika}`;
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

  submit(f: NgForm) {
    console.log(f);
    this.edit = !this.edit;
    this.ngOnInit();
  }
}
