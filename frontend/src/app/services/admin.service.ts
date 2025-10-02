import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor() {}

  private http = inject(HttpClient);
  private api = 'http://192.168.0.31:4000/korisnici';

  changeActiveStatus(korisnicko_ime: string, aktivan: boolean) {
    return this.http.post<null>(`${this.api}/changeActiveStatus`, {
      korisnicko_ime,
      aktivan,
    });
  }

  getAllUsers() {
    return this.http.get<User[]>(`${this.api}/getAllUsers`);
  }

  changeUserData(korisnik: User) {
    return this.http.post<{ ok: boolean; reason: string }>(
      `${this.api}/changeUserDataAdmin`,
      {
        user: korisnik,
      }
    );
  }
  deleteProfilePhoto(korisnicko_ime: string) {
    return this.http.post<{ ok: boolean; reason: string }>(
      `${this.api}/deleteProfilePhoto`,
      {
        korisnicko_ime,
      }
    );
  }
}
