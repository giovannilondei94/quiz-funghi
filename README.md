# Quiz Funghi

Applicazione web mobile-first sviluppata con Next.js per allenarsi all'esame per ottenimento tesserino per la raccolta dei funghi epigei spontanei nella regione Marche . 
Il progetto simula sia la prova teorica a risposta multipla sia la prova di riconoscimento visivo, con un flusso pensato per riprodurre una sessione d'esame semplice, rapida e fruibile da smartphone.

## Panoramica

L'app offre tre modalita principali:

- `Quiz`: simulazione rapida con 30 domande estratte casualmente.
- `Esame completo`: prova in due fasi, prima quiz teorico e poi riconoscimento immagini.
- `Riconoscimento immagini`: allenamento autonomo sulla parte visiva.

L'interfaccia mostra una domanda alla volta, salva la sessione in locale e restituisce un riepilogo finale con errori, soglia di superamento e dettagli delle risposte sbagliate.

## Funzionalita

- Estrazione casuale delle domande da piu gruppi tematici.
- Vincoli minimi per gruppo nella generazione del quiz.
- Valutazione finale con soglia di promozione.
- Persistenza della sessione lato client tramite `localStorage` e `sessionStorage`.
- Modalita esame con accesso alla prova immagini solo dopo il superamento del quiz teorico.
- Riepilogo finale con dettaglio degli errori.
- Interfaccia ottimizzata per uso mobile.
- Dataset quiz in file JSON locali.
- Dataset immagini con opzioni generate dinamicamente.

## Regole della simulazione

### Quiz teorico

- 30 domande totali.
- 3 opzioni di risposta per ogni domanda.
- Promozione con massimo 3 errori.

### Riconoscimento immagini

- 9 immagini totali.
- 3 immagini per ciascun gruppo `2a`, `2b`, `2c`.
- 3 opzioni di risposta per immagine.
- Promozione con almeno 6 risposte corrette.

### Esame completo

- Fase 1: quiz teorico.
- Fase 2: riconoscimento immagini.
- La seconda fase e accessibile solo se la prima viene superata.
- L'esame si considera superato solo se vengono superate entrambe le prove.

## Stack tecnologico

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `ESLint`

## Avvio in locale

### Prerequisiti

- `Node.js` 20 o superiore consigliato
- `npm`

### Installazione

```bash
npm install
```

### Ambiente di sviluppo

```bash
npm run dev
```

L'app sara disponibile su `http://localhost:3000`.

### Build di produzione

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Struttura del progetto

```text
app/                  Route dell'app con App Router
components/           Componenti UI e runner delle sessioni
data/                 Dataset domande quiz per gruppi A-E
lib/                  Logica di dominio, tipi, storage e generatori
public/               Asset statici
```

## Architettura applicativa

### Routing

La navigazione e basata su App Router di Next.js.

- `/` home con accesso alle tre modalita
- `/quiz` intro della simulazione rapida
- `/quiz/session` sessione quiz
- `/result` risultato del quiz teorico
- `/images` intro del riconoscimento immagini
- `/images/session` sessione immagini
- `/images/result` risultato riconoscimento immagini
- `/exam` intro dell'esame completo
- `/exam/session` prima fase quiz teorico
- `/exam/images` seconda fase immagini
- `/exam/images/result` esito della prova immagini nell'esame completo
- `/exam/success` schermata finale di esame superato

### Logica quiz

La logica principale e concentrata in `lib/quiz-core.ts`.

- Il quiz pesca 30 domande casuali.
- Ogni prova rispetta una distribuzione minima per gruppi `A`, `B`, `C`, `D`, `E`.
- Le domande vengono normalizzate e deduplicate prima della selezione.
- Il risultato finale calcola corrette, errate, promozione e dettaglio degli errori.

### Logica immagini

La logica di riconoscimento e definita in `lib/image-quiz-core.ts`.

- Le immagini vengono selezionate in modo casuale dai gruppi previsti.
- Le opzioni di risposta vengono costruite dinamicamente con due distrattori.
- Il sistema evita, quando possibile, ripetizioni dello stesso nome scientifico nella stessa sessione.

### Persistenza della sessione

Le sessioni vengono salvate nel browser:

- `localStorage` per lo stato della sessione in corso
- `sessionStorage` per il risultato finale mostrato nella pagina di riepilogo

Questo permette di mantenere il progresso durante la navigazione locale dell'utente, senza backend.

## Origine dei dati

### Domande del quiz

Le domande sono caricate da file JSON locali in `data/`:

- `group-a.json`
- `group-b.json`
- `group-c.json`
- `group-d.json`
- `group-e.json`

Il loader in `lib/quiz-data.ts` normalizza i record e usa un dataset di fallback interno se alcuni gruppi non contengono abbastanza domande valide.

### Immagini

Le immagini della prova visiva sono definite in `lib/image-quiz-data.ts` e caricate da URL remoti. La configurazione di Next.js consente il dominio `i.ibb.co` tramite `remotePatterns` in `next.config.ts`.

## Esperienza utente

L'interfaccia e progettata con priorita mobile:

- layout a colonna con larghezza contenuta
- navigazione lineare domanda per domanda
- barra di avanzamento
- controlli grandi e facili da usare su touch screen
- riepiloghi finali chiari e leggibili

## Stato del progetto

Il progetto e gia utilizzabile come simulatore frontend standalone. Non richiede autenticazione, database o servizi server esterni per la logica del quiz. Le immagini della prova visiva dipendono pero da una sorgente remota.

## Possibili evoluzioni

- pannello amministrativo per gestire dataset e immagini
- statistiche utente e storico tentativi
- timer per simulazioni piu realistiche
- esportazione o versionamento dei dataset
- backend/API per centralizzare contenuti e risultati
- supporto multilingua o modalita regionali

## Note per sviluppo e manutenzione

- Il progetto usa `App Router`.
- Le pagine di sessione combinano componenti server e client.
- La logica applicativa e stata separata dalla UI in `lib/` per facilitare manutenzione e test.
- In presenza di modifiche ai dataset, conviene verificare che ogni gruppo contenga abbastanza elementi per rispettare le soglie di selezione.

## Licenza

Nessuna licenza e attualmente specificata nel repository. Se il progetto deve essere pubblicato o riutilizzato, e consigliabile aggiungere un file `LICENSE`.
