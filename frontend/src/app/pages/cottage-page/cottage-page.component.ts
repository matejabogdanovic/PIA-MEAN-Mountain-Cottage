import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';
import { OwnerLayoutComponent } from '../../layouts/owner-layout/owner-layout.component';
import { TouristLayoutComponent } from '../../layouts/tourist-layout/tourist-layout.component';
import { UnregisteredLayoutComponent } from '../../layouts/unregistered-layout/unregistered-layout.component';
import { CottageComponent } from '../../components/cottage/cottage.component';
import { Cottage } from '../../models/Cottage';
import { CottageService } from '../../services/cottage.service';
import { BookStepsComponent } from '../../components/book-steps/book-steps.component';

@Component({
  selector: 'app-cottage-page',
  standalone: true,
  imports: [
    AdminLayoutComponent,
    OwnerLayoutComponent,
    TouristLayoutComponent,
    UnregisteredLayoutComponent,
    CottageComponent,
    BookStepsComponent,
  ],
  templateUrl: './cottage-page.component.html',
  styleUrl: './cottage-page.component.css',
})
export class CottagePageComponent implements OnInit {
  private userService = inject(UserService);
  private cottageService = inject(CottageService);

  private router = inject(Router);
  tip: 'admin' | 'neregistrovan' | 'vlasnik' | 'turista' = 'neregistrovan';
  korisnik: User = new User();
  loading = true;

  cottage: Cottage = new Cottage();

  constructor(private route: ActivatedRoute) {}

  error = '';
  blokirana: boolean = false;
  ngOnInit(): void {
    this.loading = true;
    this.error = '';
    let kor = this.userService.getUser();
    if (kor) {
      this.tip = kor.tip;
      this.korisnik = kor;
    }
    let _id = this.route.snapshot.paramMap.get('_id');
    if (!_id) {
      this.error = "Cottange doesn't exist.";
      this.loading = false;
      return;
    }
    this.cottageService.getCottage(_id).subscribe((cot) => {
      if (!cot) {
        this.error = "Cottange doesn't exist.";
        this.loading = false;
        return;
      }
      this.cottage = cot;
      let blokirana_do = new Date(cot.blokirana_do);
      if (new Date() < blokirana_do) {
        this.blokirana = true;
      } else {
        this.blokirana = false;
      }
      this.loading = false;
    });
  }
}
