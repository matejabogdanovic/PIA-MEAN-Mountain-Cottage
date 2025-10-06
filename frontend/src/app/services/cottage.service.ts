import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cottage } from '../models/Cottage';

@Injectable({
  providedIn: 'root',
})
export class CottageService {
  constructor() {}

  private http = inject(HttpClient);
  private api = 'http://localhost:4000/vikendice';

  getAllCottages() {
    return this.http.get<Cottage[]>(`${this.api}/getAllCottages`);
  }
  getAllCottagesUsername(korisnicko_ime: string) {
    return this.http.get<Cottage[]>(
      `${this.api}/getAllCottages/${korisnicko_ime}`
    );
  }
  addCottage(vikendica: Cottage, korisnicko_ime: string, files: File[]) {
    const formData = new FormData();

    // objekat u string
    formData.append('vikendica', JSON.stringify(vikendica));

    // fajlovi jedan po jedan
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
      console.log(i);
    }

    return this.http.post<{ ok: boolean; reason: string }>(
      `${this.api}/addCottage/${korisnicko_ime}`,
      formData
    );
  }
  editCottage(vikendica: Cottage, files: File[]) {
    const formData = new FormData();

    // objekat u string
    formData.append('vikendica', JSON.stringify(vikendica));

    // fajlovi jedan po jedan
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
      console.log(i);
    }
    return this.http.post<{ ok: boolean; reason: string }>(
      `${this.api}/editCottage`,
      formData
    );
  }
  deleteCottage(_id: string) {
    return this.http.delete<{ ok: boolean; reason: string }>(
      `${this.api}/deleteCottage/${_id}`
    );
  }
  getCottage(_id: string) {
    return this.http.get<Cottage | null>(`${this.api}/getCottage/${_id}`);
  }
  getReviews(_id: string) {
    return this.http.get<
      {
        komentar_i_ocena: { komentar: string; ocena: number };

        updatedAt: string;
      }[]
    >(`${this.api}/getReviews/${_id}`);
  }

  blockFor48hrs(_id: string) {
    return this.http.post<{ ok: boolean; reason: string }>(
      `${this.api}/blockFor48hrs`,
      { _id }
    );
  }
}
