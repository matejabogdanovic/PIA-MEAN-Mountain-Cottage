import { Component, inject, OnInit } from '@angular/core';
import { CottageService } from '../../services/cottage.service';
import { UserService } from '../../services/user.service';

import { User } from '../../models/User';
import { Cottage } from '../../models/Cottage';
import { CottageFormComponent } from '../../components/cottage-form/cottage-form.component';
import { CottageListingComponent } from '../../components/cottage-listing/cottage-listing.component';

@Component({
  selector: 'app-owner-my-cottages-page',
  standalone: true,
  imports: [CottageFormComponent, CottageListingComponent],
  templateUrl: './owner-my-cottages-page.component.html',
  styleUrl: './owner-my-cottages-page.component.css',
})
export class OwnerMyCottagesPageComponent implements OnInit {
  private cotService = inject(CottageService);
  private userService = inject(UserService);
  user: User = new User();
  cottages: Cottage[] = [];
  error = '';

  adding = false;
  added(value: boolean) {
    if (!value) {
      this.ngOnInit();
    }
  }
  edited(value: boolean) {
    if (!value) {
      this.editing = false;

      this.ngOnInit();
    }
  }
  ngOnInit(): void {
    let x = this.userService.getUser();
    if (!x) return;
    this.user = x;
    this.cotService.getAllCottagesUsername(x.korisnicko_ime).subscribe((d) => {
      console.log(d);
      this.cottages = d;
    });
  }
  editing = false;
  editing_cottage: Cottage = new Cottage();

  startEditingCottage(c: Cottage) {
    this.editing = true;
    this.editing_cottage = c;
  }

  deleteCottage(c: Cottage) {
    this.cotService.deleteCottage(c._id).subscribe((d) => {
      if (d.ok) {
        this.ngOnInit();
      } else {
        this.error = d.reason;
      }
    });
  }
}
