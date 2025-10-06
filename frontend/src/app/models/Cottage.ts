export class Cottage {
  _id: string = '';
  naziv: string = '';
  mesto: string = '';
  koordinate: { lat: Number; lng: Number } = { lat: 0, lng: 0 };
  usluge: string = '';
  cenovnik: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  telefon: string = '';
  slike: string[] = [];
  vlasnik: string = ''; // ObjectId korisnika kao string
  ocena: number = 0.0;

  blokirana_do: string = '';
}
