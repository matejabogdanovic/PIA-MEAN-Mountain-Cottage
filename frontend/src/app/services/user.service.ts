import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  private http = inject(HttpClient);
  private api = 'http://localhost:4000/korisnici';

  startSession(korisnik: User) {
    localStorage.setItem('korisnik', JSON.stringify(korisnik));
  }
  endSession() {
    localStorage.clear();
  }
  getUser(): User | null {
    let x = localStorage.getItem('korisnik');
    if (x == null) {
      return null;
    }
    return JSON.parse(x);
  }

  validatePassword(pw: string): { ok: boolean; reason: string } {
    if (!pw) return { ok: false, reason: "Password can't be empty." };

    const reLength = /^.{6,10}$/;
    const reStartsWithLetter = /^[A-Za-z]/;
    const reUpper = /[A-Z]/;
    const reThreeLower = /(?:.*[a-z]){3,}/;
    const reDigit = /\d/;
    const reSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/;

    if (!reStartsWithLetter.test(pw)) {
      return {
        ok: false,
        reason: 'Password must start with a letter.',
      };
    }
    if (!reThreeLower.test(pw) || !reUpper.test(pw)) {
      return {
        ok: false,
        reason:
          'Password must have at least 3 lowercase letters and 1 uppercase letter.',
      };
    }
    if (!reDigit.test(pw)) {
      return {
        ok: false,
        reason: 'Password must have at least 1 digit.',
      };
    }
    if (!reSpecial.test(pw)) {
      return {
        ok: false,
        reason: 'Password must have at least 1 special character.',
      };
    }
    if (!reLength.test(pw)) {
      return {
        ok: false,
        reason: 'Password length must be 6-10.',
      };
    }
    // const re =
    //   /^(?=.{6,10}$)(?=.*[A-Z])(?=(.*[a-z]){3,})(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z][A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{5,9}$/;

    return { ok: true, reason: '' };
  }

  validateCreditCard(cc: string): number {
    const diners = /^(3(0[0-3][0-9]{12}|6[0-9]{13}|8[0-9]{13}))$/;
    const master = /^(5[1-5][0-9]{14})$/;
    const viza = /^(4539|4556|4916|4532|4929|4485|4716)[0-9]{12}$/;
    if (diners.test(cc)) {
      console.log('diners');
      return 0;
    }
    if (master.test(cc)) {
      return 1;
    }
    if (viza.test(cc)) {
      return 2;
    }

    return -1;
  }

  login(korisnicko_ime: string, lozinka: string) {
    return this.http.post<User>(`${this.api}/login`, {
      korisnicko_ime,
      lozinka,
    });
  }

  loginAdmin(korisnicko_ime: string, lozinka: string) {
    return this.http.post<User>(`${this.api}/loginAdmin`, {
      korisnicko_ime,
      lozinka,
    });
  }

  unregisteredStatistics() {
    return this.http.get<{
      ukupnoVlasnika: number;
      ukupnoTurista: number;
      ukupnoVikendica: number;
    }>(`${this.api}/unregisteredStatistics`);
  }
  register(korisnik: User, file?: File) {
    const formData = new FormData();
    formData.append('user', JSON.stringify(korisnik));
    if (file) {
      formData.append('file', file);
    }

    return this.http.post<User | { ok: boolean; reason: string }>(
      `${this.api}/register`,
      formData
    );
  }
  passwordChange(
    new_password: string,
    old_password: string,
    korisnicko_ime: string
  ) {
    return this.http.post<{ ok: boolean; reason: string }>(
      `${this.api}/passwordChange/${korisnicko_ime}`,
      { new_password, old_password }
    );
  }

  changeProfilePhoto(korisnicko_ime: string, file: File) {
    const formData = new FormData();
    formData.append('korisnicko_ime', korisnicko_ime);
    formData.append('file', file);

    return this.http.post<{ ok: boolean; reason: string }>(
      `${this.api}/changeProfilePhoto`,
      formData
    );
  }
  changeUserData(korisnik: User) {
    return this.http.post<{ ok: boolean; reason: string }>(
      `${this.api}/changeUserData`,
      {
        user: korisnik,
      }
    );
  }
  getOneUser(korisnicko_ime: string) {
    return this.http.get<User>(`${this.api}/getOneUser/${korisnicko_ime}`);
  }
}
