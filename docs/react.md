
# React – Instalacija i Početak Rada

Ovaj dokument opisuje kako instalirati i koristiti React na lokalnoj mašini. Namenjeno je početnicima koji tek kreću sa radom.

---

## 1. Prerequisites (Šta je potrebno pre početka)

- **Node.js** (verzija 14 ili novija)  
  Preuzmi i instaliraj sa [https://nodejs.org](https://nodejs.org)

- **NPM** (Node Package Manager)  
  Instalira se automatski uz Node.js

- (Opcionalno) **VS Code** – preporučeni editor:  
  [https://code.visualstudio.com](https://code.visualstudio.com)

---

## 2. Kreiranje novog React projekta

Otvorite terminal (Command Prompt, PowerShell ili terminal u VS Code-u) i ukucajte:

```bash
npx create-react-app ime-projekta
```

Zameni `ime-projekta` sa imenom tvoje aplikacije.

Primer:
```bash
npx create-react-app moja-react-aplikacija
```

---

## 3. Pokretanje aplikacije

Uđi u folder aplikacije i pokreni razvojni server:

```bash
cd moja-react-aplikacija
npm start
```

Aplikacija će se otvoriti u browseru na adresi `http://localhost:3000`

---

## 4. Struktura projekta (ukratko)

```
moja-react-aplikacija/
├── node_modules/         # Zavisi od NPM paketa
├── public/               # Statički fajlovi
├── src/                  # Izvorišni kod aplikacije
│   ├── App.js            # Glavna komponenta
│   └── index.js          # Ulazna tačka aplikacije
├── package.json          # Konfiguracija projekta i zavisnosti
└── README.md             # Info fajl (možeš zameniti ovim)
```

---

## 5. Instalacija dodatnih biblioteka (primer)

Primer: instalacija React Router-a za navigaciju između stranica:

```bash
npm install react-router-dom
```

---

## 6. Izgradnja (Build) aplikacije za produkciju

Kada završiš razvoj, koristi:

```bash
npm run build
```

Ovo kreira optimizovan folder `build/` spreman za deploy.

---

## 7. Korisni saveti

- Komponente se pišu kao funkcije ili klase (`App.js`, `Header.js`, itd.)
- Stilizacija se može raditi sa običnim CSS fajlovima, CSS modulima ili bibliotekama kao što su Tailwind CSS ili Bootstrap.
- React koristi JSX (JavaScript XML) — mešavinu HTML-a i JavaScript-a.

---

## 8. Debug i Hot Reload

- Aplikacija se automatski osvežava kada izmeniš kod (Hot Reload)
- Eventualne greške će se prikazati direktno u browseru ili terminalu

---

## 9. JSX – Kratko objašnjenje

JSX je sintaksa koja kombinuje HTML i JavaScript u istom fajlu. Primer:

```jsx
const element = <h1>Zdravo, svet!</h1>;
```

U JSX-u se koristi `className` umesto `class`, i `htmlFor` umesto `for`.

---

## 10. Kreiranje novih komponenti

Komponente su osnovni deo React-a. Primer funkcionalne komponente:

```jsx
function Pozdrav(props) {
  return <h2>Zdravo, {props.ime}!</h2>;
}
```

Korišćenje u `App.js`:

```jsx
<Pozdrav ime="Ana" />
```

---

## 11. Korišćenje useState i useEffect

React koristi hook-ove za rad sa stanjem i efektima:

```jsx
import { useState, useEffect } from 'react';

function Brojac() {
  const [broj, setBroj] = useState(0);

  useEffect(() => {
    console.log("Komponenta se renderovala ili 'broj' promenjen");
  }, [broj]);

  return (
    <div>
      <p>Vrednost: {broj}</p>
      <button onClick={() => setBroj(broj + 1)}>Povećaj</button>
    </div>
  );
}
```

---

## 12. Preporučena struktura foldera (veći projekti)

```
src/
├── components/      # Sve komponente
│   └── Header.js
├── pages/           # Stranice ako koristiš React Router
│   └── HomePage.js
├── assets/          # Slike, ikonice, itd.
├── styles/          # CSS fajlovi
│   └── main.css
├── App.js
└── index.js
```

---

## 13. Učitavanje slika i stilova

**Dodavanje slika:**

Slike stavi u `src/assets/`, pa ih koristi ovako:

```jsx
import logo from './assets/logo.png';

<img src={logo} alt="Logo" />
```

**Dodavanje CSS fajla:**

U `App.js`:

```jsx
import './styles/main.css';
```

---

## 14. Linkovi

- React dokumentacija: [https://reactjs.org](https://reactjs.org)
- JSX tutorijal: [https://reactjs.org/docs/introducing-jsx.html](https://reactjs.org/docs/introducing-jsx.html)
- create-react-app info: [https://create-react-app.dev](https://create-react-app.dev)
