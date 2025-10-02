export class User {
  korisnicko_ime: string = '';
  _id: string = '';
  lozinka: string = '';
  ime: string = '';
  prezime: string = '';
  pol: 'm' | 'z' = 'm';
  adresa: string = '';
  email: string = '';
  kontakt_telefon: string = '';
  profilna_slika: string = '';
  kreditna_kartica: string = '';
  aktivan: boolean = true;
  blokiran: boolean = false;
  tip: 'admin' | 'vlasnik' | 'turista' = 'vlasnik';
}
