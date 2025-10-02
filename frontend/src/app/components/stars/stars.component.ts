import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stars',
  standalone: true,
  imports: [],
  templateUrl: './stars.component.html',
  styleUrl: './stars.component.css',
})
export class StarsComponent {
  @Input() ocena!: number;
  ceil(num: number): number {
    return Math.ceil(num);
  }
}
