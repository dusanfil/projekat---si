
# React Native – Instalacija i Početak Rada

Ovaj dokument opisuje kako instalirati i koristiti React Native za razvoj mobilnih aplikacija. Namenjeno je početnicima.

---

## 1. Prerequisites (Šta je potrebno pre početka)

- **Node.js**  
  Preuzmi sa [https://nodejs.org](https://nodejs.org)

- **Watchman** (za macOS korisnike)  
  Instalacija: `brew install watchman`

- **Java JDK**  
  Za Android razvoj: instaliraj JDK 11+

- **Android Studio**  
  Potrebno za Android emulator i build sistem

- (Opcionalno) **VS Code**  
  [https://code.visualstudio.com](https://code.visualstudio.com)

---

## 2. Instalacija React Native CLI

```bash
npm install -g react-native-cli
```

---

## 3. Kreiranje novog projekta

```bash
npx react-native init ImeProjekta
```

Primer:
```bash
npx react-native init MojaAplikacija
```

---

## 4. Pokretanje aplikacije

### Android

Pokreni Android emulator, zatim:

```bash
npx react-native run-android
```

### iOS (samo na macOS-u)

```bash
npx react-native run-ios
```

---

## 5. Struktura projekta (ukratko)

```
MojaAplikacija/
├── android/             # Android specifični kod
├── ios/                 # iOS specifični kod
├── node_modules/
├── App.js               # Glavna komponenta
├── index.js             # Ulazna tačka aplikacije
└── package.json
```

---

## 6. Kreiranje komponenti

Primer jednostavne komponente:

```jsx
import React from 'react';
import { Text, View } from 'react-native';

const Pozdrav = () => {
  return (
    <View>
      <Text>Zdravo iz React Native-a!</Text>
    </View>
  );
};

export default Pozdrav;
```

---

## 7. Korišćenje useState i useEffect

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

const Brojac = () => {
  const [broj, setBroj] = useState(0);

  useEffect(() => {
    console.log("Broj je promenjen:", broj);
  }, [broj]);

  return (
    <View>
      <Text>Vrednost: {broj}</Text>
      <Button title="Povećaj" onPress={() => setBroj(broj + 1)} />
    </View>
  );
};

export default Brojac;
```

---

## 8. Dodavanje stilova

React Native koristi `StyleSheet` za stilizaciju:

```jsx
import { StyleSheet, Text, View } from 'react-native';

const App = () => (
  <View style={styles.container}>
    <Text style={styles.naslov}>Zdravo svet</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  naslov: {
    fontSize: 20,
    color: 'blue'
  }
});
```

---

## 9. Korisne komande

- Pokretanje Metro bundlera:
  ```bash
  npx react-native start
  ```

- Čišćenje cache-a:
  ```bash
  npx react-native start --reset-cache
  ```

- Debugovanje:
  - Android: `Ctrl + M` ili shake device
  - iOS: `Cmd + D`

---

## 10. Linkovi

- React Native zvanični sajt: [https://reactnative.dev](https://reactnative.dev)
- Instalacija za svaki OS: [https://reactnative.dev/docs/environment-setup](https://reactnative.dev/docs/environment-setup)
- Komponente: [https://reactnative.dev/docs/components-and-apis](https://reactnative.dev/docs/components-and-apis)
