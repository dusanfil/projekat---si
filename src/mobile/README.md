# Mobile App

## Najbitnije funkcionalnosti aplikacije

- Aplikacija je namenjena svim učesnicima na datim događajima. 
- Korisnici (učesnici) mogu da se prijave, odnosno registruju u slučaju da nemaju nalog.
- Korisnici mogu da se prijave na određeni događaj.
- Korisnici mogu da vide sve važne informacije o događaju i slično.
- Događaju mpgu biti međusobno totalno različiti.

## Tehnologije

- React Native (JavaScript framework)
- React Navigation (namenjen za navigaciju između ekrana)
- Axios (namenjen za komunikaciju sa backendom)
- Node.js (namenjen za pokretanje lokalnog servera)
- Android Studio / Xcode(MacOS) (namenjeni za emulaciju i testiranje aplikacije)

### Ukratko o React Native-u

- `React native` je `framework` kreiran za `JavaScript`.
- Omogućava nam da isti kod koristimo i za _IOS_ i za _Android_.
- Koristi `komponentni pristup`, što znači da svaki deo korisničkog interfejsa predstavlja po jednu komponentu (npr. dugme, tabela...).

## Instalacija

### Kloniranje repozitorijuma

```bash
git clone http://gitlab.pmf.kg.ac.rs/si2025/vexa.git
cd src/mobile # Promena foldera
```

### NodeJS

#### Linux
```bash
sudo apt update
sudo apt install nodejs npm
```

#### Windows/macOs
Preuzeti sa zvaničnog sajta https://nodejs.org/en.

### Pokretanje aplikacije

#### Android

```bash
npx react-native run-android
```

#### iOS

```bash
npx react-native run-ios
```
