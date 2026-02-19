# Mobiilikehitysprojekti
Mobiilikehitysprojekti IN00ED17-3003

Käyttöliittymä suunnitelma: https://app.moqups.com/9wehYISvBnH80ExfkC6m5IitRRZGsKkb/view/page/a7bc758b4

# Ruotsin kielen harjoittelusovellus

Mobiilikehitysprojektimme on React Native -sovellus ruotsin kielen sanaston harjoitteluun. Sovellus tarjoaa erilaisia harjoitusmuotoja ja seuraa käyttäjän edistymistä. Toteutettu ryhmätyönä Mobiilikehitys-kurssilla.

## Ominaisuudet

- **Käännä suomeksi** - Ruotsinkielisen sanan kääntäminen suomeksi
- **Käännä ruotsiksi** - Suomeksi annetun sanan kääntäminen ruotsiksi
- **Yhdistä sanat** - Yhdistä ruotsinkielinen sana oikeaan suomenkieliseen käännökseen raahaamalla
- **Valitse oikea sana** - Monivalintatehtävä neljästä vaihtoehdosta
- **Tilastot** - Seuraa oikeita ja vääriä vastauksia sekä oppimispolkua
- **Profiili** - Hallitse käyttäjätiliäsi ja asetuksia
- **Ilmoitukset** - Aseta päivittäisiä muistutuksia harjoitteluun
- **Tumma tila** - Sovellus tukee vaaleaa ja tummaa teemaa

## Teknologiat

- **React Native** - Mobiilisovelluskehys
- **Expo** - Kehitysympäristö ja työkalut
- **TypeScript** - TyypeJavaScript
- **Firebase Authentication** - Käyttäjien tunnistautuminen
- **SQLite** - Paikallinen tietokanta (Expo SQLite)
- **React Navigation** - Navigointi sovelluksen sisällä
- **React Native Gesture Handler** - Eleiden käsittely

### Vaatimukset

- Node.js (v16 tai uudempi)
- npm tai yarn
- Expo CLI
- iOS-simulaattori tai Android-emulaattori

### Asennusvaiheet

1. **Kloonaa repositorio**
   ```bash
   git clone https://github.com/r2-mobiiliprojekti/Mobiilikehitysprojekti.git
   cd Mobiilikehitysprojekti
   npm install
   npm start

### Konfugurointi

## Firebase ja Expo -konfigurointi

Sovellus käyttää Firebasea käyttäjien tunnistautumiseen ja Expoa push-ilmoituksiin. Noudata näitä ohjeita oman projektin konfigurointiin.

### 1. Firebase-projektin luominen

1. Mene [Firebase Consoleen](https://console.firebase.google.com/)
2. Klikkaa "Lisää projekti" (Add project)
3. Anna projektille nimi (esim. "SanastoApp")
4. Seuraa ohjeita ja luo projekti
5. **Älä ota Google Analyticsia käyttöön** (ei välttämätön)

### 2. Firebase-tunnusten hankkiminen

Kun projekti on luotu:

1. Klikkaa projektin korttia Firebase Consolessa
2. Lisää verkkosovellus (Web) klikkaamalla </>-ikonia
3. Rekisteröi sovellus antamalla sille nimi (esim. "Sanasto-Web")
4. **Kopioi näkyviin tuleva firebaseConfig-objekti** - tarvitset sitä hetken päästä [citation:1][citation:6]
   ```javascript
   const export firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "your-project.firebaseapp.com",
     databaseURL: "default-rtdb.firebaseio.com",
     projectId: "your-project",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123...",
     measurementId: "A-123456789"
   };
5. **Kloonaa repositorio**
   ```bash
    npm install -g eas-cli
    eas login
    npx eas init

6. # Nimeä esimerkkitiedosto uudelleen
   ```bash
    cp example_firebaseConfig.ts firebaseConfig.ts
    cp example_google-services.json google-services.json

## google-services.json -tiedoston hankkiminen Firebasesta

`google-services.json` on Android-sovelluksen konfiguraatiotiedosto, joka sisältää Firebase-projektisi tunnukset. Se tarvitaan, jotta sovellus voi käyttää Firebase-palveluita, kuten Authenticationia ja push-ilmoituksia. (Mikä meidän projektissamme jäi vielä kesken. Rakentamalla valmiin APK. Buildin tämän saa toimimaan.)

### Vaihe 1: Luo Firebase-projekti (jos ei jo ole)

1. Mene [Firebase Consoleen](https://console.firebase.google.com/)
2. Klikkaa **"Lisää projekti"** (Add project)
3. Anna projektille nimi (esim. "SanastoApp")
4. **Älä ota Google Analyticsia käyttöön** (ei välttämätön tälle sovellukselle)
5. Klikkaa **"Luo projekti"** (Create project)

### Vaihe 2: Lisää Android-sovellus Firebase-projektiin

1. Kun projekti on luotu, klikkaa **Android-kuvaketta** (`</>`) projektin yleiskatsaussivulla
   
   Tai jos olet jo projektin asetuksissa:
   - Klikkaa hammasratas-ikonia  → **"Project settings"**
   - Vieritä alas kohtaan **"Your apps"**
   - Klikkaa **"Add app"** → valitse **Android**

2. **Täytä seuraavat tiedot**:
   
   - **Android package name**: Tarkista tämä `app.json`-tiedostosta kohdasta `expo.android.package`
     ```
     Esimerkki: com.sanasto.app
     ```
   
   - **App nickname** (valinnainen): "Sanasto"
   
   - **Debug signing certificate SHA-1** (valinnainen):
     - Tarvitaan puhelinnumerokirjautumiseen ja dynaamisiin linkkeihin
     - Voit lisätä sen myöhemminkin

3. Klikkaa **"Register app"**

### Vaihe 3: Lataa google-services.json -tiedosto

1. Rekisteröinnin jälkeen näet ohjeet Firebase SDK:n lisäämiseen
2. Klikkaa **"Download google-services.json"**
3. Tiedosto latautuu tietokoneellesi

### Vaihe 4: Lisää tiedosto projektiin

1. **Nimeä esimerkkitiedosto uudelleen** (jos olet jo kopioinut sen):
   ```bash
   # Projektin juuressa
   cp example_google-services.json google-services.json
  


7. ### Rakenne:
   ```bash
     sanasto/
     ├── src/
     │   ├── Components/          
     │   │   ├── ThemeToggle.tsx
     │   │   └── ...
     │   ├── Contexts/            
     │   │   └── ThemeContext.tsx
     │   ├── Screens/             # Näkymät
     │   │   ├── HomeScreen.tsx
     │   │   ├── FinSwe.tsx
     │   │   ├── SweFin.tsx
     │   │   ├── ConnectWords.tsx
     │   │   ├── PickWord.tsx
     │   │   ├── StatsScreen.tsx
     │   │   ├── ProfileScreen.tsx
     │   │   ├── LoginScreen.tsx
     │   │   ├── SignupScreen.tsx
     │   │   ├── MainScreen.tsx
     │   │   └── NotificationSettingsScreen.tsx
     │   ├── Services/            # Palvelut ja apufunktiot
     │   │   ├── sanastoService.ts
     │   │   ├── databaseService.ts
     │   │   ├── firebaseService.ts
     │   │   ├── statisticsService.ts
     │   │   ├── notificationHelpers.ts
     │   │   └── ...
     │   ├── Types/               
     │   │   ├── navigation.ts
     │   │   ├── sanasto.ts
     │   │   └── ...
     │   └── api/                  # API-kutsut
     │       └── Freedict/
     │           └── fetcher.ts
     ├── assets/                    # Kuvat ja fontit
     ├── App.tsx                     # Pääkomponentti
     ├── app.json                    # Expo-konfiguraatio
     └── package.json                # Riippuvuudet

8. ### Käytetyt paketit sekä niiden versiot projektissamme:
   ```bash
   ├── @react-native-async-storage/async-storage@2.2.0
   ├── @react-native-community/datetimepicker@8.4.4
   ├── @react-native-firebase/auth@23.8.6
   ├── @react-navigation/native-stack@7.13.0
   ├── @react-navigation/native@7.1.28
   ├── @types/react@19.1.17
   ├── axios@1.13.5
   ├── expo-audio@1.1.1
   ├── expo-device@8.0.10
   ├── expo-firebase-app@2.0.0
   ├── expo-firebase-auth@2.0.0
   ├── expo-notifications@0.32.16
   ├── expo-sqlite@16.0.10
   ├── expo@54.0.33
   ├── firebase@12.9.0
   ├── react-dom@19.1.0
   ├── react-native-chart-kit@6.12.0
   ├── react-native-gesture-handler@2.28.0
   ├── react-native-pie-chart@4.0.2
   ├── react-native-reanimated@4.1.6
   ├── react-native-safe-area-context@5.6.2
   ├── react-native-screens@4.16.0
   ├── react-native-svg@15.12.1
   ├── react-native-web@0.21.2
   ├── react-native-worklets@0.5.1
   ├── react-native@0.81.5
   ├── react@19.1.0
   └── typescript@5.9.3
