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
  addCottage(vikendica: Cottage, korisnicko_ime: string) {
    return this.http.post<{ ok: boolean; reason: string }>(
      `${this.api}/addCottage/${korisnicko_ime}`,
      { vikendica }
    );
  }
  editCottage(vikendica: Cottage) {
    return this.http.post<{ ok: boolean; reason: string }>(
      `${this.api}/editCottage`,
      { vikendica }
    );
  }
  deleteCottage(_id: string) {
    return this.http.delete<{ ok: boolean; reason: string }>(
      `${this.api}/deleteCottage/${_id}`
    );
  }
}
