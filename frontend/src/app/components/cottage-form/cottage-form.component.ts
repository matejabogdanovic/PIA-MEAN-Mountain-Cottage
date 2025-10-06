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

  openAddCottage() {
    this.adding = true;
    this.addingChange.emit(this.adding);
  }

  selectedFiles: File[] = [];

  allowedTypes = ['image/jpeg', 'image/png']; // dozvoljeni formati
  onFilesSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    this.selectedFiles.forEach((file) => {
      // provera tipa fajla
      if (!this.allowedTypes.includes(file.type)) {
        this.error = 'Allowed formats: JPG i PNG';
        this.selectedFiles = [];
        return;
      }

      this.error = '';
    });
  }
  seasons = [1, 1, 0, 0, 2, 2, 2, 2, 0, 0, 0, 1];
  checkPrices() {
    for (let i = 0; i < this.cottage.cenovnik.length; i++) {
      if (this.cottage.cenovnik[i] < 0) {
        return { ok: false, reason: "Prices can't be negative." };
      }
    }
    let summer_season = this.cottage.cenovnik.slice(4, 8);
    let winter_season = [
      ...this.cottage.cenovnik.slice(0, 4),
      ...this.cottage.cenovnik.slice(8, 12),
    ];
    const distinct_summer = [...new Set(summer_season)];
    const distinct_winter = [...new Set(winter_season)];
    if (distinct_summer.length > 1 && distinct_winter.length > 1) {
      return {
        ok: true,
        reason: '',
      };
    }

    return {
      ok: false,
      reason:
        'Make sure that you enter at least two different prices for summer (May, June, July, August) and winter season (other).',
    };
  }
  clearFile(input: HTMLInputElement) {
    input.value = '';
    this.selectedFiles = [];
    this.error = '';
  }

  cancel() {
    this.selectedFiles = [];
    this.error = '';
    this.adding = false;
    this.addingChange.emit(this.adding);
    this.ngOnInit();
  }

  submit(form: NgForm) {
    // debug console.log(this.cottage);
    if (!this.isEditing && this.selectedFiles.length == 0) {
      this.error = 'Please, select at least one photo.  ';
      return;
    }

    let prices = this.checkPrices();
    if (!prices.ok) {
      this.error = prices.reason;
      return;
    }
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
      ? this.cotService.editCottage(this.cottage, this.selectedFiles)
      : this.cotService.addCottage(
          this.cottage,
          this.user.korisnicko_ime,
          this.selectedFiles
        )
    ).subscribe((d) => {
      if (d.ok) {
        this.cancel();
      } else {
        this.error = d.reason;
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      alert('Molimo izaberite validan JSON fajl.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        // debug console.log('Parsed JSON object:', json);
        let cot = json as Cottage;
        this.cottage.naziv = cot.naziv;
        this.cottage.mesto = cot.mesto;
        this.cottage.koordinate = cot.koordinate;
        this.cottage.usluge = cot.usluge;
        this.cottage.cenovnik = cot.cenovnik;
        this.cottage.telefon = cot.telefon;
      } catch (e) {
        console.error('Nevalidan JSON', e);
      }
    };

    reader.onerror = () => {
      console.error('Reading Error');
    };

    reader.readAsText(file);
  }
}
