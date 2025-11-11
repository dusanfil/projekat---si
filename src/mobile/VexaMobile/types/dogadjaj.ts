export type Dogadjaj = {
  id: string; // MongoDB ObjectId
  naziv: string;
  lokacija: string; // ObjectId as string
  datumPocetka: string; // ISO date string (from DateTime)
  datumKraja: string;   // ISO date string
  urLalbuma: string;
  opis: string;
  kapacitet: number;
  karte: string[];       // List of ObjectId strings
  dani: string[];        // List of ObjectId strings
  prijavljeni: string[]; // user ids or emails?
  tagovi: string[];
  notifikacije: string[]; // List of ObjectId strings
  napomene: string[];     // List of ObjectId strings
  organizator: string;    // ObjectId as string
  status: string;
};

export type Slika = {
  url: string;
  altText?: string;
};
export type Podrucje= {
  id: string;
  dogadjajId: string;
  danId: string;
  naziv: string;
  lokacije: string[];
  koordinate: number[][];
  hexBoja: string;
}

export type Karta = {
  id: string;
  naziv: string;
  opis: string;
  hexboja: string;
  tip: TipKarte;
  urLslike: string;
  cena: number;
  brojKarata: number;
  dogadjajId: string;
  danId: string;
  brojDana: number;
}

export type KupljenaKarta = {
  id: string; 
  kartaId: string;
  korisnikId: string; 
  datumVremeKupovine: string;
  brojDana: number;
};


export type Korisnik = {
  id: string;
  korisnickoIme: string;
  email: string;
  brojTelefona: string | null;
  uloga: "korisnik" | "admin" | string;
  verifikovanEmail: boolean;
  kartica: string | null; 
  karte: string[];
  balans: number;
  omiljeniDogadjaji:string[]
};

export enum TipKarte {
  Regular,
  VIP,
  Besplatna,
  RaniPristup
}

export type DanDogadjaja = {
  id: string; // MongoDB ObjectId as string
  naziv: string;
  opis: string;
  datumOdrzavanja: string;  // ISO date string

  podrucja: string[];  // list of ObjectId strings
  dogadjaj: string;    // ObjectId string
  aktivnosti: string[]; // list of ObjectId strings
  
};

export type Koordinata = {
  latituda: number;
  longituda: number;
};


export type Tacka = {
  id: string;
  naziv: string;
  opis: string;
  latituda: number;
  longituda: number;
  resursi: Resurs[];         
  tipTacke: TipTackeEnum;
};
export enum TipTackeEnum {
  Bina,
  InfoPult,
  Toalet,
  PunktZaHranuIPice,
  Radionica,
  IzlozbeniStand,
}

export type Resurs = {
  naziv: string,
  tip: string,
  kolicina: number,

};
export enum InteresovanjaEnum {
  Muzika,
  Sport,
  Tehnologija,
  Kultura,
  Edukacija,
  Zabava
};

export enum TipAktivnosti {
  Koncert,
  Predavanje,
  Igrica,
  Izlozba,
  Radionica,
  Druzenje,
  Ostalo
}

export type Aktivnost = {
  id: string; // MongoDB ObjectId as string
  naziv: string;
  opis: string;
  datumVremePocetka: string; // ISO date string
  datumVremeKraja: string;   // ISO date string

  lokacija: string;  // ObjectId string
  dan: string;       // ObjectId string
  dogadjaj: string;  // ObjectId string

  tip: TipAktivnosti;  // enum as string

  notifikacije: string[]; // array of ObjectId strings
  resursi: string[];      // array of ObjectId strings
}

export type Lokacija = {
  id: string;           // Jedinstveni ID lokacije
  dogadjajId: string;   // ID događaja kojem lokacija pripada
  naziv: string;        // Naziv lokacije (npr. WC, bina, štand)
  opis: string;         // Detaljan opis lokacije (ako je potreban)
  xKoordinata: number;  // X koordinata na mapi
  yKoordinata: number;  // Y koordinata na mapi
  urlSlikeMape: string; // URL slike mape sa označenim lokacijama (ako je potrebno)

  cenovnik: string;     // ID cenovnika za lokaciju
  podrucje: string;     // ID podrucja

  hexBoja: string;

  tipLokacije: string;  // tip lokacije enum (consider making this a TS enum)
}