import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-unregistered-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './unregistered-page.component.html',
  styleUrl: './unregistered-page.component.css',
})
export class UnregisteredPageComponent implements OnInit {
  private userService = inject(UserService);

  ngOnInit(): void {}
}
