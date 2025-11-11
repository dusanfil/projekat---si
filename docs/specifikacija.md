**SPECIFIKACIJA SOFTVERSKIH ZAHTEVA**

1. **Uvod**
    1. **Svrha dokumenta**

Ovaj dokument opisuje funkcionalne zahteve sistema za organizaciju događaja. Aplikacija se sastoji iz web aplikacije za organizatore i mobilne aplikacije za učesnike. Cilj sistema je da omogući efikasno planiranje, upravljanje i praćenje događaja kroz digitalno okruženje, uz podršku za rad sa resursima, kalendarima i mapama.

- 1. **Opis**

Sistem omogućava organizatorima da kreiraju događaje, upravljaju prijavama, resursima i dobavljačima, dok učesnici preko mobilne aplikacije mogu da se informišu, prijave, pregledaju, sadržaj događaja i koriste digitalne funkcionalnosti tokom samog događaja.

1. **Funkcionalni zahtevi**
    1. **Obavezne funkcionalnosti:**

- Organizator može:
  - Da se registruje/prijavi
    - Organizator ima mogućnost da kreira nalog na platformi unosom osnovnih podataka (ime, e-mail, lozinka). Nakon registracije, može se prijaviti na svoj nalog i pristupiti kontrolnoj tabli za upravljanje događajima.
  - Kreirati i uređivati događaj
    - Organizator može kreirati novi događaj unosom detalja kao što su naziv, datum, vreme, lokacija, opis, kategorija i maksimalan broj učesnika. Događaj se kasnije može menjati – ažurirati informacije, dodavati stavke i upravljati elementima događaja.
  - Upravljati resursima
    - Organizator može dodeljivati i raspoređivati dostupne resurse (oprema, prostorije, tehnički timovi, itd.) za svaki događaj. Takođe može uređivati i uklanjati postojeće resurse u skladu sa planom događaja.
  - Evidentirati prijavljene učesnike
    - Sistem automatski beleži sve učesnike koji su se prijavili na događaj putem mobilne aplikacije. Organizator ima pristup listi prijavljenih učesnika sa mogućnošću pretrage, sortiranja i izvoza podataka.
  - Obrisati događaj ili pojedine elemente.
    - Organizator može u potpunosti obrisati događaj koji je prethodno kreirao, ili ukloniti pojedine elemente kao što su aktivnosti, resursi ili napomene vezane za događaj.
  - Uređivati napomene događaja
    - Organizator može dodavati, menjati ili brisati napomene i komentare vezane za organizaciju događaja. Napomene mogu služiti kao interni podsetnici ili kao informacije dostupne učesnicima.
  - Prikazati pregled svih svojih događaja
    - Organizator može pristupiti listi svih događaja koje je organizovao, uz detaljan pregled za svaki – uključujući broj prijavljenih učesnika, spisak dobavljača angažovanih za događaj i pregled dodeljenih resursa.
  - Obavestiti prijavljene učesnike o izmenama
    - U slučaju promene termina, lokacije, sadržaja ili drugih važnih informacija, organizator može poslati automatska obaveštenja svim prijavljenim učesnicima putem mobilne aplikacije (notifikacije ili poruke).
- Mobilna aplikacija omogućava učesnicima:

  - Registraciju/prijavu
    - Učesnici imaju mogućnost da kreiraju svoj korisnički nalog direktno putem mobilne aplikacije. Prilikom registracije unose osnovne podatke kao što su ime, prezime, e-mail i lozinka. Nakon registracije, korisnici mogu da se prijave korišćenjem svojih podataka za pristup funkcionalnostima aplikacije. Prijavljeni korisnici imaju personalizovan prikaz događaja i uvida u podatke koji se odnose na njih.
  - Prijavu na događaj
    - Nakon što se prijave u aplikaciju, korisnici mogu da pregledaju listu dostupnih događaja, detalje o svakom događaju (lokacija, vreme, organizator, sadržaj) i izvrše prijavu na željeni događaj jednim klikom. Sistem beleži njihove prijave, a organizator ima uvid u listu prijavljenih učesnika.
  - Praćenje rasporeda događaja putem kalendara i mape
    - Mobilna aplikacija omogućava korisnicima da prate tok događaja kroz integrisani kalendar i mapu. Kalendar prikazuje aktivnosti po danima i vremenskim terminima, dok interaktivna mapa prikazuje fizičku lokaciju svake aktivnosti ili punkta na događaju (npr. bina, radionica, info pult). Korisnici se mogu lako orijentisati i pratiti šta se, kada i gde odvija.
  - Uvid u stanje kredita
    - Svaki učesnik može videti trenutno stanje svojih virtuelnih kredita koji se koriste za kupovinu proizvoda i usluga tokom događaja. Prikazuje se ukupna količina dostupnih kredita, kao i eventualna istorija transakcija, ukoliko je implementirana. Ova funkcionalnost omogućava korisnicima da efikasno planiraju trošenje kredita.
  - Tabelarni prikaz cenovnika
    - Aplikacija omogućava korisnicima pregled svih proizvoda i usluga koji se mogu platiti tokom događaja. Cenovnik je predstavljen u tabelarnom obliku, sa jasno prikazanim nazivima proizvoda/usluga, kratkim opisima i pripadajućim cenama izraženim u kreditima ili valuti događaja. Tabela može biti sortirana i filtrirana radi lakšeg snalaženja korisnika.

    1. **Poželjne funkcionalnosti:**
- Mapa prikazuje prostorni raspored događaja
  - Mapa u veb i mobilnoj aplikaciji omogućava prikaz celokupnog rasporeda događaja u prostoru – uključujući lokacije bine, štandova, mesta za sedenje, toaleta, punktova za hranu i piće, i slično. Omogućena je interakcija, kao što su zumiranje, klik na tačku za više informacija, navigacija do lokacije unutar prostora i sl.
- Kalendar prikazuje dnevni raspored, s mogućnošću pregleda po danima
  - Integrisani kalendarski prikaz omogućava korisnicima da jednostavno prate dnevne aktivnosti. Prikaz uključuje listu događaja za svaki dan, vreme početka i završetka, kao i mogućnost filtriranja po vrsti događaja. Korisnici mogu da pregledaju raspored po danima, nedeljama ili satima, čime se povećava preglednost.
- Pretraga i filtriranje događaja
  - Korisnici mogu pretraživati događaje po ključnim rečima (naziv, tip događaja, vreme), kao i filtrirati prikaz po interesovanjima, vremenu, lokaciji i dr.
- Veb aplikacija je responzivna i prilagođena mobilnim uređajima i desktop računarima

  - Korisnički interfejs aplikacije je dizajniran tako da automatski prilagođava raspored i veličinu elemenata u zavisnosti od uređaja sa kog se pristupa – bilo da je u pitanju telefon, tablet ili desktop računar. Time se omogućava optimalno korisničko iskustvo na svim platformama.

    1. **Opcione funkcionalnosti:**
- Prikaz dostupnih proizvoda sa slikama u mobilnoj aplikaciji.
  - Korisnici mogu da pregledaju ponudu proizvoda i usluga koji su dostupni tokom događaja, uz prikaz slika, opisa i cena. Ova funkcionalnost omogućava lakšu selekciju i planiranje potrošnje kredita, kao i vizuelni uvid u ponudu (npr. hrana, suveniri, oprema).
- QR kod za brzu prijavu na događaj
  - Učesnici mogu dobiti jedinstveni QR kod koji koriste za brzu registraciju/prijavu na događaj prilikom ulaska.
- Uvid učesnika o stanju kredita i pregled cenovnika
  - Učesnici putem aplikacije mogu pratiti koliko kredita trenutno poseduju i kako su ih trošili. Takođe, mogu pregledati cenovnik usluga i proizvoda koji su dostupni tokom događaja. Cenovnik je jasan i pregledan, sa mogućnošću sortiranja po nazivu, ceni ili kategoriji.

1. **Tehnologije**
    1. Frontend (Veb): React
    2. Frontend (Mobilni): React Native
    3. Backend: .NET core
<<<<<<< HEAD
    4. Baza podataka: MongoDB
=======
    4. Baza podataka: Microsoft SQL server
>>>>>>> igor.perovic-master-patch-23583
    5. Mape: OpenStreetMaps
    6. Autentifikacija: .NET identity
    7. Dodatno: rad sa QR kodom, kalendar komponenta