<<<<<<< HEAD
# Dokumentacija: Tehnologije korišćene u projektu "Organizacija događaja"

## MongoDB

### Opis
MongoDB je nerelacioni sistem za upravljanje bazama podataka. Podaci se čuvaju u obliku BSON dokumenata (slično JSON-u), što omogućava fleksibilnu strukturu podataka bez unapred definisanih šema.

U projektu se koristi za čuvanje:
- podataka o događajima (naziv, lokacija, datum, tip)
- korisnicima (učesnici i organizatori)
- prijavama na događaje

### Instalacija

#### Windows
1. Preuzeti instalaciju sa [zvanične MongoDB stranice](https://www.mongodb.com/try/download/community)
2. Instalirati MongoDB server i MongoDB Compass (GUI alat)
3. Pokrenuti MongoDB kao servis (automatski se aktivira posle instalacije)

#### Linux (Ubuntu)
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Konekcija iz .NET aplikacije
U `appsettings.json`:
```json
{
  "MongoDB": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "OrganizacijaDogadjajaDB"
  }
}
```

U `Program.cs` koristi se konfiguracija za dependency injection i pristup bazi pomoću `MongoDB.Driver`.
=======
# Microsoft SQL Server

## Opis
Microsoft SQL Server je relacioni sistem za upravljanje bazama podataka (RDBMS) koji koristi SQL jezik za upravljanje i manipulaciju podacima. Pogodan je za skalabilne aplikacije kojima su potrebni pouzdanost, integritet i visoke performanse.

Koristi se za čuvanje podataka o korisnicima, događajima, resursima i drugim ključnim entitetima sistema.

## Instalacija

### Windows
- Preuzmi SQL Server Express sa zvanične stranice:  
  https://www.microsoft.com/en-us/sql-server/sql-server-downloads
- Pokreni instalaciju i izaberi "Basic" ili "Custom" način.
- Instaliraj SQL Server Management Studio (SSMS) za upravljanje bazama:  
  https://aka.ms/ssmsfullsetup
- Pokreni SSMS i poveži se na lokalni server (npr. localhost\SQLEXPRESS).

### Linux (Ubuntu)
- Dodaj Microsoft repozitorijum i instaliraj SQL Server:
curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
curl https://packages.microsoft.com/config/ubuntu/20.04/mssql-server-2019.list | sudo tee /etc/apt/sources.list.d/mssql-server.list
sudo apt-get update
sudo apt-get install -y mssql-server
sudo /opt/mssql/bin/mssql-conf setup


### Osnovne komponente
- **SQL Server Engine** – upravlja bazom podataka i izvršava upite.
- **SQL Server Management Studio (SSMS)** – grafički alat za administraciju.
- **SQLCMD** – komandni interfejs za rad sa bazom.

### Korišćenje
SQL Server čuva i upravlja podacima za backend aplikacije. Konekcija se ostvaruje putem konekcionog stringa u .NET Core aplikaciji, koji omogućava razmenu podataka između aplikacije i baze.
>>>>>>> igor.perovic-master-patch-23583

---

## .NET Core

### Opis
<<<<<<< HEAD
.NET Core (konkretno ASP.NET Core) je framework za razvoj višeslojnih i višplatformskih aplikacija. Koristi se za kreiranje REST API-ja koji komunicira sa bazom i frontend aplikacijama.
=======
.NET Core je višplatformski framework za razvoj modernih web servisa i aplikacija. U aplikaciji za organizaciju događaja koristi se za kreiranje backend REST API-ja koji povezuje frontend sa bazom podataka.
>>>>>>> igor.perovic-master-patch-23583

### Instalacija

#### Windows
<<<<<<< HEAD
- Preuzeti i instalirati .NET SDK sa [https://dotnet.microsoft.com/en-us/download](https://dotnet.microsoft.com/en-us/download)
- Opcionalno: instalirati Visual Studio sa ASP.NET & web razvojem

#### Linux (Ubuntu)
```bash
=======
- Preuzmi i instaliraj .NET SDK sa:  
https://dotnet.microsoft.com/en-us/download
- (Opcionalno) Instaliraj Visual Studio sa podrškom za .NET Core.

#### Linux (Ubuntu)
>>>>>>> igor.perovic-master-patch-23583
wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get update
sudo apt-get install -y dotnet-sdk-7.0
<<<<<<< HEAD
```

### Komponente korišćene u projektu
- **ASP.NET Core Web API** – za obradu HTTP zahteva
- **MongoDB.Driver** – za komunikaciju sa MongoDB bazom
- **DTO modeli i servisi** – za obradu i validaciju podataka
- **Middleware** – za autentifikaciju, logovanje, CORS i greške
- **Dependency Injection** – za automatsko upravljanje servisima

### Primer REST API kraja:
```http
GET /api/dogadjaji
POST /api/dogadjaji
PUT /api/dogadjaji/{id}
DELETE /api/dogadjaji/{id}
```

---

## React & React Native

### Opis
React se koristi za razvoj web aplikacije (za organizatore), dok se React Native koristi za mobilnu aplikaciju (za učesnike).

### Ključne tehnologije u frontend-u:
- **React Router** – za navigaciju
- **Axios** – za HTTP komunikaciju sa backend-om
- **Tailwind CSS** (ili CSS po izboru) – za stilizaciju
- **Formik + Yup** – za validaciju formi (prijava, dodavanje događaja itd.)
- **OpenStreetMap** – za prikaz lokacija događaja

### Primer frontend funkcionalnosti:
- Lista događaja sa filterima
- Forma za dodavanje/izmenu događaja
- Prijava učesnika na događaj
- Prikaz mape sa lokacijom događaja


---

## Povezivanje celog sistema

```
[ React / React Native ]
           ⇅ REST API
     [ ASP.NET Core (.NET) ]
           ⇅
       [ MongoDB baza ]
```

---


Ovaj sistem koristi modernu i fleksibilnu arhitekturu:
- MongoDB za dinamičko čuvanje podataka
- ASP.NET Core za poslovnu logiku i API-je
- React i React Native za korisnički interfejs (web + mobilni)
- OpenStreetMap za prikaz geografskih podataka

Kombinacijom ovih tehnologija postiže se **brz i prilagodljiv sistem za organizaciju događaja**, spreman za dalje proširenje (autentifikacija, obaveštenja, PDF izveštaji, itd.).
=======

### Osnovne komponente
- **ASP.NET Core Web API** – za kreiranje RESTful servisa.
- **Entity Framework Core** – ORM za rad sa bazom podataka.
- **Dependency Injection** – upravljanje zavisnostima.
- **Middleware** – obrada HTTP zahteva i odgovora.

### Korišćenje
Backend prihvata i obrađuje HTTP zahteve od frontend aplikacija (React, React Native), komunicira sa SQL Server bazom i obezbeđuje siguran i efikasan pristup podacima.

---

## Ostale tehnologije

### React / React Native
- Koriste se za razvoj korisničkih interfejsa (web i mobilnih aplikacija).
- Komuniciraju sa .NET Core backendom preko REST API-ja.
- Prikazuju podatke i funkcionalnosti organizacije događaja.

### OpenStreetMap
- Koristi se za prikaz i rad sa mapama u aplikaciji.
- Omogućava prikaz lokacija događaja i geolokaciju korisnika.

---

## Zaključak
Ove tehnologije zajedno čine moćan i skalabilan sistem za organizaciju događaja, sa jasnom podelom uloga i efikasnom komunikacijom između komponenata.
>>>>>>> igor.perovic-master-patch-23583
