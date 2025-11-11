# MongoDB Dokumentacija

MongoDB je NoSQL baza podataka koja koristi dokumentni model za skladištenje podataka. Umesto tabela i redova (kao u relacijskim bazama), MongoDB koristi kolekcije i dokumente (u JSON formatu).

## Sadržaj

- [Instalacija MongoDB-a](#instalacija-mongodb-a)
  - [Instalacija na Windows](#instalacija-na-windows)
  - [Instalacija na Linux (Ubuntu)](#instalacija-na-linux-ubuntu)
- [Osnovno korišćenje](#osnovno-korišćenje)
  - [Pokretanje MongoDB-a](#pokretanje-mongodb-a)
  - [Mongo Shell komande](#mongo-shell-komande)
  - [CRUD operacije](#crud-operacije)
- [Korisni alati](#korisni-alati)
- [Reference](#reference)

---

## Instalacija MongoDB-a

### Instalacija na Windows

1. Idi na [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Izaberi:
   - **Version**: najnovija
   - **OS**: Windows
   - **Package**: MSI
3. Pokreni instalacioni fajl (.msi) i prati korake:
   - Odaberi "Complete" instalaciju
   - Omogući MongoDB kao servis
4. Po završetku, instaliraj i **MongoDB Compass** (grafički alat za rad s bazom)

### Instalacija na Linux (Ubuntu)

```bash
sudo apt update
sudo apt install gnupg
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt update
sudo apt install -y mongodb-org
```

> Pokreni MongoDB servis:
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

## Osnovno korišćenje

### Pokretanje MongoDB-a

- **Linux/WSL**:
```bash
sudo systemctl start mongod
```

- **Windows**:
MongoDB se pokreće automatski kao servis. Ako nije, koristi:
```bash
net start MongoDB
```

### Ulazak u Mongo Shell

```bash
mongosh
```

Ako koristiš stariju verziju:
```bash
mongo
```

---

## Mongo Shell komande

### Rad sa bazama

```javascript
show dbs               // Prikaz postojećih baza
use imeBaze            // Prelazak u bazu (kreira se automatski ako ne postoji)
db                     // Prikazuje aktivnu bazu
```

### Rad sa kolekcijama

```javascript
show collections       // Prikaz kolekcija u bazi
db.korisnici.insertOne({ime: "Petar", godine: 25})  // Dodaj dokument
db.korisnici.find()    // Prikaz svih dokumenata u kolekciji
```

---

## CRUD operacije

### Create

```javascript
db.korisnici.insertOne({ime: "Ana", godine: 22})
db.korisnici.insertMany([{ime: "Mila"}, {ime: "Jovan"}])
```

### Read

```javascript
db.korisnici.find()
db.korisnici.find({ime: "Ana"})
```

### Update

```javascript
db.korisnici.updateOne({ime: "Ana"}, {$set: {godine: 23}})
db.korisnici.updateMany({}, {$set: {aktivno: true}})
```

### Delete

```javascript
db.korisnici.deleteOne({ime: "Jovan"})
db.korisnici.deleteMany({})
```

---

## Korisni alati

- **MongoDB Compass** – Grafički interfejs za rad sa bazama
- **Mongoose** – ODM biblioteka za korišćenje MongoDB-a u Node.js projektima
- **Robo 3T** – Alternativni GUI alat

---

## Reference

- Zvanična dokumentacija: [https://www.mongodb.com/docs/](https://www.mongodb.com/docs/)
- Instalacija za sve platforme: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
