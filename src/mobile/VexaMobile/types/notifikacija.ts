export enum TipNotifikacije{
    Informacija,
    Upozorenje,
    Hitno
}

export interface Notifikacija {
  id: string;
  naziv: string;
  sadrzaj: string;
  tip: TipNotifikacije;
  datumSlanja: Date;
  dogadjajId: string; 
  korisniciIds: string[];
}