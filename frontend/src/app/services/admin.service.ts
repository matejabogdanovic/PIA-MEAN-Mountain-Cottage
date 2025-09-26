import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor() {}

  private http = inject(HttpClient);
  private api = 'http://localhost:4000/korisnici';

  changeActiveStatus(korisnicko_ime: string, aktivan: boolean) {
    return this.http.post<null>(`${this.api}/changeActiveStatus`, {
      korisnicko_ime,
      aktivan,
    });
  }
}
