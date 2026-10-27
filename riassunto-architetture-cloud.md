# Project work “Conti correnti” e Architetture cloud

**Documento di sintesi**  
**Fonte:** `01 - Architetture cloud - 27 ottobre 2026.pdf` (Giornata 1, 37 slide)  
**Codice analizzato:** `Frontend-main/`, `BackEnd-main/`  
**Data:** 27 ottobre 2026

---

## Premessa

Il progetto è una **web app bancaria** (“BancaTerreVenete”): gestione del conto corrente, movimenti, bonifico, ricarica telefonica, profilo e autenticazione.

> **Attenzione:** `BackEnd-main/readme.md` e `BackEnd-main/assignments-def.yaml` descrivono un’altra applicazione (classi, docenti e studenti). Non corrispondono al codice realmente presente e non vanno usati come documentazione dell’architettura.

---

## 1. Architettura complessiva

```text
Browser
   │ HTTP/JSON
Angular 21 SPA  ──(proxy /api in sviluppo)──▶  Express 5 + TypeScript
                                                   │ Mongoose
                                                   ▼
                                            MongoDB Atlas
                                                   ▲
                                                   │
                                      Nodemailer → provider SMTP
```

Rispetto alle slide:

- **Tre livelli logici:** presentazione (Angular), logica/API (Express), dati (MongoDB).
- **Più nodi fisici:** frontend e backend girano su processi locali separati; il database è già esterno, su **MongoDB Atlas**.
- **Connettori:** HTTP/JSON tra SPA e API, protocollo MongoDB/Mongoose tra API e database, SMTP per le email.
- **Configurazione:** `proxy.conf.json` per il development, variabili `.env` per SMTP/JWT, `angular.json` per build e proxy.
- **Stile architetturale:** **monolite modulare a livelli**, non microservizi. I moduli backend sono separati per dominio:
  - `auth`
  - `conto-corrente`
  - `movimento-conto-corrente`
  - `bonifico-ricarica`
  - `categorie-movimenti`
  - `ricerca-movimenti`
  - `audit-log`
  - `accesso`
- Non ci sono API gateway, message broker, cache, container, orchestrazione o CI/CD.

---

## 2. Tecnologie frontend

| Tecnologia | Uso nel progetto |
|---|---|
| **Angular 21** | SPA con componenti standalone, routing, pagine e layout |
| **TypeScript 5.9** | Tipizzazione strict |
| **Angular Router** | Rotte pubbliche (`login`, `registrazione`) e protette (`home`, `movimenti`, `bonifico`, `ricarica`, `profilo`, ecc.) |
| **Functional auth guard** | Blocca le pagine se l’utente non è autenticato e reindirizza al login |
| **HttpClient + functional interceptor** | Aggiunge automaticamente `Authorization: Bearer <token>` alle chiamate API |
| **RxJS** | Gestione delle chiamate HTTP e degli stream |
| **Signals Angular** | Stato reattivo locale: `signal`, `computed`, `input`, `effect` |
| **Reactive Forms** | Login, registrazione, bonifico, ricarica, ricerca movimenti |
| **Servizi Angular** | `AuthService`, `JwtService`, `MovimentiService`, `ProfiloService`, `MovimentoService` |
| **Pipes built-in** | `DatePipe`, `DecimalPipe` per date e importi |
| **CSS custom + media query** | Layout responsive con sidebar, navbar e griglia; **non** è presente Bootstrap/ng-bootstrap |
| **Vitest + jsdom** | Test unitari generati dall’Angular CLI |
| **Prettier** | Formattazione del codice |
| **Export CSV lato client** | `Blob` + `URL.createObjectURL` per scaricare i movimenti |

Il frontend è quindi una **SPA statica**: può essere pubblicata su hosting statico/CDN o su un servizio PaaS, ma nel repo non c’è una configurazione di deploy.

---

## 3. Tecnologie backend

| Tecnologia | Uso nel progetto |
|---|---|
| **Node.js + TypeScript** | Runtime e linguaggio del server |
| **Express 5** | API REST JSON |
| **Architettura a livelli** | `router → controller → service → model/entity` |
| **Mongoose 9 / MongoDB driver 7** | ODM, schemi e accesso a MongoDB |
| **MongoDB Atlas** | Database cloud con replica set |
| **Passport** | Strategia `local` per login e strategia `jwt` |
| **bcrypt** | Hash delle password |
| **jsonwebtoken** | Token JWT con scadenza 7 giorni |
| **class-validator + class-transformer** | Validazione e trasformazione dei DTO |
| **Nodemailer** | Invio email di verifica tramite SMTP |
| **crypto** | Token casuale per la verifica email |
| **dotenv** | Configurazione tramite variabili d’ambiente |
| **morgan** | Logging HTTP |
| **cors** | Abilitazione CORS |
| **body-parser** | Parsing del body JSON |
| **lodash** | Utility, ad esempio `pick` |
| **@dellacagna/iban** | Generazione di IBAN italiani |
| **nodemon + tsx + tsc** | Sviluppo, esecuzione TypeScript e build |

### Autenticazione e identità

Il flusso è:

1. registrazione con email/password e dati del conto;
2. password salvata con **bcrypt**;
3. creazione di un token di verifica email con scadenza 24 ore;
4. invio email tramite **Nodemailer/SMTP**;
5. login tramite **Passport local**;
6. emissione **JWT** con `contoCorrenteId` ed `email`;
7. chiamate protette con `Authorization: Bearer`;
8. middleware che verifica il JWT e mette l’utente in `req.user`;
9. quasi tutte le query usano `req.user.contoCorrenteId`, quindi il backend filtra per il conto del chiamante.

Sono presenti anche:

- **Access log:** IP, data/ora, esito del login.
- **Audit log:** operazioni come bonifico e ricarica, con IP, esito e conto.
- **Verifica email** con indice TTL MongoDB.
- **Movimento iniziale** di apertura conto dopo la verifica.

---

## 4. Dati e modello

Collezioni principali:

| Collezione | Ruolo |
|---|---|
| `ContoCorrente` | Utente/conto, credenziali, IBAN, verifica email |
| `MovimentoContoCorrente` | Movimenti con importo, saldo progressivo, categoria, descrizione |
| `CategoriaMovimento` | Categorie entrata/uscita |
| `VerificaEmail` | Token di verifica con scadenza |
| `Accesso` | Log dei tentativi di login |
| `AuditLog` | Log delle operazioni bancarie |

Caratteristiche:

- Il **saldo** non è un campo del conto: viene ricavato dall’ultimo movimento (`Saldo`).
- Ogni movimento salva anche il **saldo progressivo**.
- Le relazioni sono in gran parte gestite tramite **stringhe/ID**, non con `ref`/`populate`; solo `AuditLog` e `VerificaEmail` usano `ObjectId` con `ref`.
- Il bonifico crea **due movimenti**: uscita dal conto mittente ed entrata sul conto destinatario.
- Non vengono usate transazioni MongoDB: è un punto critico per la coerenza dei dati.

---

## 5. Collegamento diretto con le slide

| Tema della lezione | Nel progetto |
|---|---|
| **Componenti, connettori, configurazione** | Angular, API Express, MongoDB, SMTP; HTTP/JSON, Mongoose, SMTP |
| **Architettura a tre livelli** | Web app → API e business logic → conti e movimenti |
| **Livelli logici e nodi fisici** | Tre livelli logici, ma oggi due processi locali + DB cloud |
| **Pattern architetturali** | MVC-like/layered; **monolite modulare**, non microservizi |
| **Cloud computing** | DB e SMTP sono servizi gestiti; l’applicazione non è ancora deployata in cloud |
| **On-premise vs cloud** | Codice portabile, ma attualmente frontend/backend locali e dati su Atlas → configurazione **ibrida** |
| **Scalabilità** | API **stateless** grazie al JWT: può essere replicata orizzontalmente; manca però load balancer/autoscaling |
| **Elasticità** | Non configurata: nessun autoscaling, nessun container orchestrato |
| **IaaS** | Scenario possibile: VM con Node e Angular |
| **PaaS** | Scenario consigliato: backend su App Service/Render/Railway, frontend su hosting statico, DB Atlas |
| **SaaS** | Provider SMTP gestito; Atlas è più correttamente DBaaS/PaaS |
| **Serverless** | Non usato; potrebbe essere usato per email o export, ma non è configurato |
| **Public/private/hybrid/multi-cloud** | Public cloud per Atlas; **ibrido** per il resto; **multi-cloud non presente** |
| **TCO** | Servizi gestiti riducono il lavoro operativo, ma aggiungono costi di tier, storage, backup, egress e lock-in |
| **Responsabilità condivisa** | Il provider gestisce OS/runtime/DB/rete; il team gestisce codice, dati, accessi, backup e verifiche |
| **Identità e autorizzazione** | JWT, bcrypt, verifica email, filtro per `contoCorrenteId`; controllo di titolarità non uniforme |
| **Alta disponibilità** | Atlas ha replica set; il backend è un singolo processo → single point of failure |
| **Fault tolerance** | Assente: nessun retry/circuit breaker; bonifico non transazionale |
| **Disaster recovery** | Non definito: nessuna procedura di restore, nessun RPO/RTO dichiarato |
| **Replica vs backup** | Atlas replica non sostituisce un backup: una cancellazione si propaga alla replica |
| **RPO/RTO** | Non dichiarati nel progetto |
| **Prova di ripristino** | Non presente |

---

## 6. I cinque scenari della lezione applicati al progetto

1. **Backup** — “il servizio è nel cloud, il backup è già risolto”: **falso**. Atlas può avere backup automatici, ma nel repo non c’è configurazione né prova di restore. Bisogna verificare policy, retention e RPO/RTO.

2. **Cancellazione dei movimenti** — la replica non basta: se cancelli per errore, la cancellazione arriva anche sulla replica. Serve un **backup point-in-time** e una procedura di ripristino testata.

3. **Conto altrui** — la maggior parte delle API usa il `contoCorrenteId` del JWT, quindi il controllo c’è. Però il dettaglio movimento recupera il movimento per ID e poi il conto, **senza verificare che appartenga al chiamante**: è un possibile IDOR. La titolarità va controllata nel backend, non nella UI.

4. **Due provider** — non è il modello attuale. Sarebbe multi-cloud, con costi di integrazione, identità, rete, egress e gestione doppia; non basta “due provider” per essere più resilienti.

5. **Servizio email** — Nodemailer + SMTP esternalizza il server mail, ma la registrazione crea l’utente prima dell’invio. Se l’SMTP fallisce, l’utente resta non verificato e non c’è retry/coda: è il guasto tipico dello scenario 5.

---

## 7. Criticità tecniche rilevanti per il cloud

Le più importanti da sistemare o almeno dichiarare al gruppo:

1. **Segreti nel codice:** la stringa di connessione Atlas con credenziali è hardcoded in `src/index.ts`; inoltre il JWT viene firmato con un secret scritto nel controller e verificato con `process.env.JWT_SECRET`. La strategia Passport `jwt` usa un terzo secret diverso (`my_jwt_secret`), quindi le rotte che passano da `isAuthenticated` possono fallire. Va usato **un solo secret, solo da environment/secret manager**.
2. **URL localhost hardcoded** in alcuni service Angular (`http://localhost:3000/api/...`): impediscono il deploy e bypassano il proxy. Andrebbero usati URL relativi `/api` o environment di build.
3. **Bonifico non transazionale:** uscita e entrata sono due scritture separate; se la seconda fallisce, i soldi “spariscono”. Servono **transazione MongoDB** e **idempotency key** per evitare doppi addebiti su retry.
4. **Saldo calcolato sull’ultimo movimento:** due operazioni concorrenti possono leggere lo stesso saldo e generare saldi incoerenti. È il punto più delicato per scalabilità e fault tolerance.
5. **Mancano indici** su `ContoCorrenteID` + `Data` nei movimenti e su `IBAN`: con molti dati le ricerche diventano costose. Atlas scala, ma le query senza indici restano lente.
6. **Error handler centralizzato non montato:** `errorHandlers` è definito ma non registrato in `app.ts`; inoltre mancano health check, metriche e logging strutturato. Per un servizio cloud sono necessari.
7. **Nessuna configurazione di deploy:** niente Docker, CI/CD, backup, restore test, RPO/RTO. Il progetto è “cloud-ready”, non ancora “cloud-native”.
8. **Sicurezza:** CORS aperto, JWT in `localStorage`, token stampato nei log, nessun rate limiting/helmet. Sono scelte da rivedere in produzione.
9. **Documentazione disallineata:** README e specifica OpenAPI descrivono un’altra applicazione (classi/studenti), non quella bancaria.

---

## 8. Sintesi in tre punti

- Il progetto è un **monolite modulare a tre livelli**: Angular 21 per la presentazione, Express 5 + TypeScript per la logica, MongoDB Atlas per i dati, con autenticazione JWT, bcrypt, verifica email e servizio SMTP esterno.
- Rispetto alla lezione, è già **cloud-ready** nella separazione dei componenti e nell’uso di DB e SMTP gestiti, ma oggi è un **ibrido**: applicazione locale + dati/servizi cloud. Manca la parte di deploy, scalabilità automatica, backup/restore e osservabilità.
- Le decisioni da portare al gruppo sono: **PaaS o IaaS**, gestione dei segreti, transazioni/idempotenza sui bonifici, indici, backup con RPO/RTO dichiarati e una prova di ripristino ripetibile.

---

## Riferimenti ai file analizzati

### Frontend

- `Frontend-main/package.json`
- `Frontend-main/angular.json`
- `Frontend-main/proxy.conf.json`
- `Frontend-main/src/app/app.config.ts`
- `Frontend-main/src/app/app.routes.ts`
- `Frontend-main/src/app/utils/auth.guard.ts`
- `Frontend-main/src/app/utils/auth.interceptor.ts`
- `Frontend-main/src/app/services/auth.service.ts`
- `Frontend-main/src/app/services/jwt.service.ts`
- `Frontend-main/src/app/services/movimenti.service.ts`
- `Frontend-main/src/app/components/lista-movimenti/lista-movimenti.component.ts`
- `Frontend-main/src/app/pages/login/login.component.ts`
- `Frontend-main/src/app/pages/register/register.component.ts`
- `Frontend-main/src/app/pages/home/home.component.ts`
- `Frontend-main/src/app/pages/bonifico/bonifico.component.ts`
- `Frontend-main/src/app/pages/ricarica/ricarica.component.ts`
- `Frontend-main/src/app/pages/movimenti/movimenti.component.ts`

### Backend

- `BackEnd-main/package.json`
- `BackEnd-main/src/index.ts`
- `BackEnd-main/src/app.ts`
- `BackEnd-main/src/api/routes.ts`
- `BackEnd-main/src/api/auth/auth.controller.ts`
- `BackEnd-main/src/api/auth/auth.middleware.ts`
- `BackEnd-main/src/api/auth/auth.dto.ts`
- `BackEnd-main/src/api/utils/validation-middleware.ts`
- `BackEnd-main/src/api/utils/auth/local/local-strategy.ts`
- `BackEnd-main/src/api/utils/auth/jwt/jwt-strategy.ts`
- `BackEnd-main/src/api/registrazione/registrazione.service.ts`
- `BackEnd-main/src/api/registrazione/verifica-email.service.ts`
- `BackEnd-main/src/api/conto-corrente/conto-corrente.model.ts`
- `BackEnd-main/src/api/movimento-conto-corrente/movimento-conto-corrente.model.ts`
- `BackEnd-main/src/api/movimento-conto-corrente/movimento-conto-corrente.service.ts`
- `BackEnd-main/src/api/bonifico-ricarica/bonifico.controller.ts`
- `BackEnd-main/src/api/bonifico-ricarica/ricarica.controller.ts`
- `BackEnd-main/src/api/ricerca-movimenti/ricerca-movimenti.service.ts`
- `BackEnd-main/src/api/utils/audit-log/audit-log.service.ts`
- `BackEnd-main/src/api/accesso/accesso.service.ts`
