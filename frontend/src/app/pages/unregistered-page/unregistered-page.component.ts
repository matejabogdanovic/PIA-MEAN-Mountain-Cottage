import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CottageService } from '../../services/cottage.service';
import { Cottage } from '../../models/Cottage';

@Component({
  selector: 'app-unregistered-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './unregistered-page.component.html',
  styleUrl: './unregistered-page.component.css',
})
export class UnregisteredPageComponent implements OnInit {
  private userService = inject(UserService);
  private cotService = inject(CottageService);
  cottages: Cottage[] = [];
  ngOnInit(): void {
    this.cotService.getAllCottages().subscribe((d) => {
      console.log(d);
      this.cottages = d;
    });
  }
}
