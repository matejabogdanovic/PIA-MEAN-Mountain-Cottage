import { Component, Input } from '@angular/core';
import { User } from '../../models/User';

@Component({
  selector: 'app-user-listing',
  standalone: true,
  imports: [],
  templateUrl: './user-listing.component.html',
  styleUrl: './user-listing.component.css',
})
export class UserListingComponent {
  @Input() user!: User;
  @Input() showtype: boolean = false;
}
