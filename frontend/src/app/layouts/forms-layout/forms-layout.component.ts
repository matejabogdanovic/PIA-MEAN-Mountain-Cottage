import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-forms-layout',
  standalone: true,
  imports: [RouterOutlet, NgClass],
  templateUrl: './forms-layout.component.html',
  styleUrl: './forms-layout.component.css',
})
export class FormsLayoutComponent {
  pageTitle = '';
  styles = '1';
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.pageTitle = data['pageTitle'];
      this.styles = data['styles'] ?? '1';
    });
  }
}
