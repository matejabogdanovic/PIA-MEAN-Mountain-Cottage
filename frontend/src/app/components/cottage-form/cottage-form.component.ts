import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Cottage } from '../../models/Cottage';
import { User } from '../../models/User';
import { CottageService } from '../../services/cottage.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-cottage-form',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './cottage-form.component.html',
  styleUrl: './cottage-form.component.css',
})
export class CottageFormComponent {
  private cotService = inject(CottageService);
  @Input() user!: User;
  @Input() cottage: Cottage = new Cottage();
  ngOnInit(): void {}

  @Input() adding!: boolean;
  @Input() isEditing: boolean = false;

  // Event koji salje promene roditelju
  @Output() addingChange = new EventEmitter<boolean>();
  error = '';
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  seasons = [1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1];
  openAddCottage() {
    this.adding = true;
    this.addingChange.emit(this.adding);
  }

  selectedFiles: File[] = [];
  onFilesSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  checkPrices() {
    // todo
  }

  cancel() {
    this.selectedFiles = [];
    this.error = '';
    this.adding = false;
    this.addingChange.emit(this.adding);
    this.ngOnInit();
  }

  submit(form: NgForm) {
    console.log(this.cottage);
    if (
      !form.valid ||
      this.cottage.naziv.trim() === '' ||
      this.cottage.mesto.trim() === ''
    ) {
      this.error =
        'Fields are not in required format or required fields are empty.';
      return;
    }

    (this.isEditing
      ? this.cotService.editCottage(this.cottage)
      : this.cotService.addCottage(this.cottage, this.user.korisnicko_ime)
    ).subscribe((d) => {
      if (d.ok) {
        this.cancel();
      } else {
        this.error = d.reason;
      }
    });
  }
}
