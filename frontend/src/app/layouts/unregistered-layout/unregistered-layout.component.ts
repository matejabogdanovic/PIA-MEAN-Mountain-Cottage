import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-unregistered-layout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './unregistered-layout.component.html',
  styleUrl: './unregistered-layout.component.css',
})
export class UnregisteredLayoutComponent {}
