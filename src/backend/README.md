# Backend Aplikacije

## Najbitnije funkcionalnosti backend aplikacije

- Backend aplikacija razvijena je za upravljanje događajima.
- Organizatorima omogućava registraciju i prijavu, kreiranje događaja, upravljanje događajima, kao i samim učesnicima na tim događajima.
- Učesnicima omogućava prijavu na događaje, kao i pristup informacijama o samim događajima.
- API je spreman za integraciju sa bilo kojom frontend tehnologijom.

## Tehnologije

- **ASP.NET Core** (web framework za izradu API-ja)
- **C#** (programski jezik)
- **MongoDB** - (nerelaciona baza podataka koju backend koirsti za čuvanje podataka)
- **OpenStreetMap API** (API koji koristimo za implementaciju mapa za prikaz lokacije događaja / Zvanična dokumentacija: https://wiki.openstreetmap.org/wiki/OpenStreetMap_API)

## Preuzimanje i pokretanje aplikacije

### Unapred potrebno

- **.NET SDK**: https://dotnet.microsoft.com/download
- **IDE** (Visual Studio ili Visual Studio Code)
- **MongoDB**: https://www.mongodb.com/
- **MailHog**: (Lokalni SMTP server) https://github.com/mailhog/MailHog/releases

### Kloniranje repozitorijuma
```bash
git clone http://gitlab.pmf.kg.ac.rs/si2025/vexa.git
cd src/backend/EventOrganizerAPI # Promena foldera
```

### Instalacija MailHog-a

1. **Preuzimanje**
- Preuzeti MailHog sa https://github.com/mailhog/MailHog/releases
- Windows: `MailHog_windows_amd64.exe`
- Linux: `MailHog_linux_amd64`
- macOS: `MailHog_darwin_amd64`

2. **Pokretanje**
- Na Windows-u je samo potrebno pokrenuti `.exe` fajl.
- Na Linux/macOS-u, u terminalu:
```bash
./MailHog_linux_amd64 #Linux
./MailHog_darwin_amd64 #macOS
```

3. **Dostupno na:**
- SMTP server na portu 1025
- Web UI http://localhost:8025


### Instalacija .net zavisnosti

```bash
dotnet restore
```

### Konfiguracija baze podataka
U `appsettings.json` fajlu potrebno je uneti konekcioni string za bazu.

```
"ConnectionStrings" :{
    "MongoDb": "mongodb://localhost:27017"
}
```

### Pokretanje aplikacije

```bash
dotnet run
```
Aplikacija će biti dostupna na `https://localhost:5001` ili `http://localhost:5000` <br>

### API Dokumentacija /TODO
Još uvek nije dostupna.