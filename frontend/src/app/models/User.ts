export class User {
  korisnicko_ime: string = '';
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
  tip: 'admin' | 'vlasnik' | 'turista' = 'vlasnik';
}
