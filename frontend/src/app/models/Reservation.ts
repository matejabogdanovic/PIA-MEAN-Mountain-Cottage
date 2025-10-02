export class Reservation {
  _id: string = '';
  cottage_id: string | { naziv: string; mesto: string; slike: string[] } = '';
  user_id: string = '';
  od: string = '';
  do: string = '';
  total: number = 0;
  napomena: string = '';
  createdAt: string = '';
  prihvacena: boolean = false;
  odbijenica: string = '';
  komentar_i_ocena: {
    komentar: string;
    ocena: number;
  } = {
    komentar: '',
    ocena: 0,
  };
}

export class ReservationPopulated {
  _id: string = '';
  cottage_id: {
    _id: string;
    naziv: string;
    mesto: string;
    slike: string[];
  } = {
    _id: '',
    naziv: '',
    mesto: '',
    slike: [],
  };
  user_id: string = '';
  od: string = '';
  do: string = '';
  total: number = 0;
  napomena: string = '';
  createdAt: string = '';
  prihvacena: boolean = false;
  odbijenica: string = '';
  komentar_i_ocena: {
    komentar: string;
    ocena: number;
  } = {
    komentar: '',
    ocena: 0,
  };
  nov_komentar = '';
  nova_ocena = 0;
}
