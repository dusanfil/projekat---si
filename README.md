# Event organizer 
### Tim Vexa
---
### Opis
Aplikacija namenjena za kreiranje dogadjaja, prikaz i prijavu na njih, kao i upravljanje resursima.

--- 

### Glavne funkcionalnosti
- **Mobilna aplikacija**
    - Pregled dostupnih događaja
    - Prijava i odjava sa događaja
    - Notifikacije i podsetnici za buduće događaje
    - Link za preuzimanje mobilne aplikacije: http://softeng.pmf.kg.ac.rs:11073
    - Test nalozi za mobilnu aplikaciju:
      - -u MarkoZmaj123 -p 123456
      - -u dusanfil -p dusanfil
- **Web aplikacija**
  - Kreiranje i uređivanje događaja
  - Upravljanje resursima i kapacitetima
  - Pregled prijava i statistika
  - Link za preuzimanje web aplikacije: http://softeng.pmf.kg.ac.rs:11072
  - Test nalozi za web:
    - Organizatori:
     
      - -u cofi -p sifra123
      - -u MarkoZmaj -p 123456
    - Dobavljaci:

      - -u DakiZmaj -p sifra123
---
### Tech stack

- **Backend**  
  Kreiran u C# ASP .NET Core, pruža REST API za komunikaciju sa frontend i mobilnim aplikacijama, uz sigurnu autentifikaciju i autorizaciju korisnika.  
  Detaljnije: [Backend dokumentacija](src/backend/README.md)
- **Frontend**  
  Razvijen u React-u, fokusiran na responzivni dizajn i user-friendly interfejs za upravljanje događajima i resursima.  
  Detaljnije: [Frontend dokumentacija](src/frontend/README.md)

- **Mobile**  
  Implementiran u React Native-u, omogućava korisnicima da prate i prijavljuju se na događaje direktno sa mobilnih uređaja.  
  Detaljnije: [Mobile dokumentacija](src/mobile/README.md)
---