# Project work “Conti correnti” e Architetture cloud — slide 1–12

**Documento di sintesi**  
**Fonte:** `01 - Architetture cloud - 27 ottobre 2026.pdf`  
**Perimetro:** solo le slide **1–12** (Giornata 1, prima parte)  
**Codice analizzato:** `Frontend-main/`, `BackEnd-main/`  
**Data:** 27 ottobre 2026

---

## Premessa e perimetro

Questa analisi si ferma alla **slide 12**, “Una API su IaaS oppure PaaS”.  
Non vengono quindi trattati i temi delle slide successive: serverless, modelli di distribuzione, TCO, migrazione, responsabilità condivisa, identità e autorizzazione, alta disponibilità, backup, RPO/RTO e scenari.

Il progetto è una **web app bancaria** (“BancaTerreVenete”): conto corrente, movimenti, bonifico, ricarica telefonica, profilo e autenticazione.

> **Nota:** `BackEnd-main/readme.md` e `BackEnd-main/assignments-def.yaml` descrivono un’altra applicazione (classi, docenti e studenti) e non corrispondono al codice presente. Non sono stati usati come fonte per questa analisi.

---

## 1. Mappa delle slide 1–12 sul progetto

| Slide | Concetto | Evidenza nel progetto |
|---|---|---|
| 1 | Titolo: architettura dell’applicazione e modelli cloud | Web app bancaria con frontend, API e database |
| 2 | Percorso in tre giornate | Questa analisi copre solo la prima prospettiva: applicazione e cloud |
| 3 | Che cosa chiamiamo architettura? | Componenti, comunicazione e scelte del sistema |
| 4 | Componenti, connettori e configurazione | Angular, Express, MongoDB, SMTP; HTTP/JSON, Mongoose, SMTP; `.env` e proxy |
| 5 | Architettura a tre livelli | Presentazione → logica/API → dati |
| 6 | Livelli logici e nodi fisici | Tre livelli logici distribuiti su più processi/nodi |
| 7 | Pattern architetturali | Architettura a livelli; monolite modulare; niente microservizi né bus |
| 8 | Cloud computing | DB e servizio email esterni; applicazione ancora locale |
| 9 | On-premise e cloud | Codice locale + dati/servizi cloud = configurazione ibrida |
| 10 | Scalabilità ed elasticità | API stateless potenzialmente scalabile; nessun autoscaling |
| 11 | Modelli di servizio | IaaS/PaaS per l’API; DBaaS/PaaS per Atlas; SaaS per l’SMTP |
| 12 | API su IaaS o PaaS | Due possibili deployment dell’API Express |

---

## 2. Che cosa è “architettura” in questo progetto

Seguendo la slide 3, l’architettura non è solo l’elenco delle tecnologie, ma risponde a tre domande:

1. **Quali componenti formano il sistema?**
   - SPA Angular;
   - API Express;
   - database MongoDB;
   - servizio SMTP per le email;
   - browser dell’utente.

2. **Come comunicano?**
   - browser ↔ Angular: caricamento della SPA e navigazione lato client;
   - Angular ↔ API: HTTP/JSON;
   - API ↔ MongoDB: driver MongoDB/Mongoose;
   - API ↔ provider email: SMTP.

3. **Quali scelte ne guidano l’evoluzione?**
   - separazione in tre livelli;
   - API REST come confine tra frontend e backend;
   - database gestito esternamente;
   - configurazione tramite variabili d’ambiente e proxy di sviluppo.

---

## 3. Componenti, connettori e configurazione

### Componenti principali

| Componente | Tecnologia | Funzione |
|---|---|---|
| Presentazione | Angular 21 + TypeScript | UI, routing, form, chiamate API |
| Logica applicativa | Node.js + Express 5 + TypeScript | API REST, validazione, regole sui conti |
| Dati | MongoDB + Mongoose | Persistenza di conti, movimenti e categorie |
| Servizio email | Nodemailer + SMTP | Invio email di verifica |
| Runtime di sviluppo | Angular CLI, `tsx`, `nodemon` | Esecuzione locale dei due processi |

### Connettori

- **HTTP/JSON** tra SPA e API.
- **Mongoose/MongoDB** tra API e database.
- **SMTP** tra API e provider email.
- **Proxy Angular** (`proxy.conf.json`) per inoltrare `/api` da `localhost:4200` a `localhost:3000` in sviluppo.

### Configurazione

- `angular.json`: build, serve e proxy.
- `proxy.conf.json`: regola di inoltro `/api`.
- `.env`: parametri SMTP e JWT.
- `package.json`: dipendenze e script di avvio/build.

La configurazione è già separata dal codice in parte, ma non completamente: alcuni URL e segreti sono ancora scritti direttamente nei file sorgente.

---

## 4. Architettura a tre livelli

```text
┌─────────────────────────────┐
│ Presentazione               │
│ Angular SPA                 │
│ (browser, routing, form)    │
└──────────────┬──────────────┘
               │ HTTP/JSON
┌──────────────▼──────────────┐
│ Logica / API                │
│ Express + TypeScript        │
│ controller, service, DTO    │
└──────────────┬──────────────┘
               │ Mongoose
┌──────────────▼──────────────┐
│ Dati                        │
│ MongoDB Atlas               │
│ conti, movimenti, categorie │
└─────────────────────────────┘
```

Corrispondenza con la slide 5:

- **Presentazione:** componenti Angular, pagine, navbar, sidebar, form.
- **Logica:** router, controller, service, validazione DTO.
- **Dati:** collezioni MongoDB e modelli Mongoose.

La separazione è rispettata: il frontend non accede direttamente al database; il backend non genera HTML; il database non contiene logica applicativa.

---

## 5. Livelli logici e nodi fisici

La slide 6 distingue i **livelli logici** dai **nodi fisici**. Nel progetto:

| Livello logico | Nodo fisico attuale |
|---|---|
| Presentazione | Browser + processo `ng serve` (o build statica) |
| Logica/API | Processo Node.js/Express sulla porta 3000 |
| Dati | Cluster MongoDB Atlas esterno |
| Email | Provider SMTP esterno |

Quindi lo stesso schema logico a tre livelli viene eseguito su **più nodi**. Questo introduce:

- confini di rete tra frontend e API;
- un altro confine di rete tra API e database;
- configurazione CORS e proxy;
- dipendenza dalla latenza e dalla disponibilità dei servizi esterni.

Rispetto a un deployment “tutto su un nodo”, la distribuzione è già reale, anche se frontend e backend girano ancora in locale.

---

## 6. Pattern architetturali

La slide 7 cita MVC, microservizi e bus.

### Nel progetto

- **Architettura a livelli / MVC-like:** il backend separa router, controller, service, model/entity. Il frontend separa componenti, template, servizi e routing. Non è MVC puro, ma il principio è lo stesso: separare responsabilità.
- **Monolite modulare:** l’API è un’unica applicazione deployabile, organizzata per domini:
  - `auth`
  - `conto-corrente`
  - `movimento-conto-corrente`
  - `bonifico-ricarica`
  - `categorie-movimenti`
  - `ricerca-movimenti`
  - `audit-log`
  - `accesso`
- **Microservizi:** non usati. I moduli hanno confini logici, ma condividono lo stesso processo e lo stesso database.
- **Bus / message broker:** non presente. La comunicazione è sincrona HTTP; non ci sono eventi asincroni.

### Conseguenza architetturale

Il progetto è un **monolite modulare**: più semplice da sviluppare e deployare rispetto a microservizi, ma con un unico punto di deployment per tutta la logica. In futuro, moduli come autenticazione, movimenti o export potrebbero diventare servizi separati, ma solo se ci fosse un motivo concreto (carico, autonomia, responsabilità).

---

## 7. Cloud computing

La slide 8 definisce il cloud come un modello di erogazione di risorse attraverso la rete, con:

- richiesta di risorse;
- pool condiviso;
- uso misurabile.

### Nel progetto

| Caratteristica | Situazione |
|---|---|
| Risorse richieste tramite rete | MongoDB Atlas e provider SMTP sono raggiunti via rete |
| Pool condiviso | Il database e il servizio email sono infrastrutture gestite da provider |
| Uso misurabile | I servizi esterni hanno piani, quote e consumo misurabile |
| Applicazione locale | Frontend e backend non sono ancora erogati come servizio cloud |

Quindi il progetto usa **servizi cloud**, ma non è ancora **un’applicazione interamente in cloud**. È una fase intermedia: il codice è portabile, i dati e le email sono già esternalizzati.

---

## 8. On-premise e cloud

| Aspetto | Nel progetto |
|---|---|
| Risorse locali | Frontend e backend girano sulla macchina di sviluppo; il codice è locale |
| Servizi cloud | MongoDB Atlas per i dati; provider SMTP per le email |
| Dove vivono i dati | Nel database cloud |
| Dove vive il codice | Nel repository locale |
| Dove viene eseguita la logica | Sul processo Node locale |
| Responsabilità operative | Il team gestisce codice, configurazione e segreti; il provider gestisce DB e servizio email |

La configurazione attuale è quindi **ibrida**: non è full on-premise, perché i dati sono nel cloud, ma non è nemmeno full cloud, perché l’applicazione non è deployata su un’infrastruttura cloud.

Questa è una buona base per la migrazione: il codice non dipende dal filesystem locale per i dati e l’API è già separata dal frontend.

---

## 9. Scalabilità ed elasticità

La slide 10 distingue:

- **scalabilità:** capacità di aumentare la capacità quando cresce il carico;
- **elasticità:** capacità di adattare automaticamente la capacità alla domanda.

### Scalabilità potenziale

| Livello | Come può scalare | Stato attuale |
|---|---|---|
| Frontend | hosting statico + CDN | build Angular possibile, ma nessun deploy configurato |
| API | più istanze Express dietro load balancer | l’API è stateless, quindi è adatta; manca la configurazione |
| Database | aumento del tier o scalabilità gestita di Atlas | già gestito dal provider |
| Email | servizio esterno | scalability del provider |

L’API è **stateless** perché non mantiene sessioni server-side: l’autenticazione viaggia nel token JWT. Questo è un vantaggio per la scalabilità orizzontale, perché più istanze possono servire richieste diverse senza condividere sessioni.

### Elasticità

Non è implementata:

- nessun autoscaling;
- nessun container orchestrato;
- nessun load balancer configurato;
- nessuna metrica di carico o regola di scaling;
- un solo processo backend in sviluppo.

Quindi il progetto è **scalabile in teoria**, ma **non elastico** nella pratica.

### Limiti alla scalabilità

- Alcune query non hanno indici espliciti su `ContoCorrenteID` e `Data`.
- Il saldo viene ricavato dall’ultimo movimento, con logica read-then-write.
- Non ci sono cache o code per assorbire picchi.
- Il frontend e il backend usano ancora URL locali in alcuni servizi.

---

## 10. Modelli di servizio: IaaS, PaaS, SaaS

La slide 11 distingue:

| Modello | Risorsa o funzione | Esempio |
|---|---|---|
| IaaS | macchine e rete | macchina virtuale |
| PaaS | ambiente applicativo | hosting del backend |
| SaaS | applicazione pronta | posta e collaborazione |

### Applicazione al progetto

| Componente | Modello possibile | Motivo |
|---|---|---|
| API Express | **IaaS** | La si installa su una VM con OS, Node, process manager e reverse proxy |
| API Express | **PaaS** | Si deploya il codice e la piattaforma gestisce runtime, build e processo |
| Frontend Angular | hosting statico/CDN o PaaS | Dopo `ng build` sono file statici |
| MongoDB Atlas | **DBaaS/PaaS** | Database gestito: non è un’applicazione pronta come il SaaS puro |
| Provider SMTP | **SaaS** | Servizio email già pronto, usato tramite credenziali |

Attenzione a non chiamare “SaaS” tutto ciò che è gestito: Atlas è un servizio di database gestito (DBaaS), mentre il SaaS è un’applicazione completa usata dall’utente finale.

---

## 11. Una API su IaaS oppure PaaS

La slide 12 confronta due deployment della stessa API.

### Scenario IaaS

```text
VM
 └── sistema operativo
      └── runtime Node.js
           └── API Express
                └── MongoDB Atlas
```

Il team deve gestire:

- patch del sistema operativo;
- installazione e aggiornamento di Node;
- process manager (es. PM2);
- reverse proxy e TLS;
- log e monitoraggio della VM;
- capacità della macchina.

### Scenario PaaS

```text
Piattaforma gestita
 └── build + runtime
      └── API Express
           └── MongoDB Atlas
```

Il team deve gestire:

- codice e dipendenze;
- variabili d’ambiente;
- build e start command;
- connessione al database;
- regole applicative.

La piattaforma gestisce sistema operativo, runtime, scaling di base e parte dell’operatività.

### Quale scegliere per questo progetto?

Per un project work, il **PaaS** è la scelta più coerente:

- riduce il lavoro operativo;
- permette di concentrarsi sulle regole dei conti;
- è sufficiente per un’API Express con database esterno;
- rende il deployment più ripetibile.

L’IaaS avrebbe senso se servisse controllo completo su rete, sistema operativo o software installato sulla macchina.

### Cosa non cambia tra IaaS e PaaS

Le regole del conto restano da progettare:

- chi può operare su un conto;
- come si calcola il saldo;
- come si registra un bonifico;
- come si validano importi e IBAN;
- come si mantiene la coerenza dei movimenti.

Il modello di servizio cambia **chi gestisce l’infrastruttura**, non la logica applicativa.

---

## 12. Stack tecnologico osservato (entro le slide 1–12)

### Frontend

- Angular 21, componenti standalone;
- TypeScript strict;
- Angular Router;
- Reactive Forms;
- HttpClient e interceptor;
- RxJS e Signals;
- CSS custom responsive;
- Vitest e Prettier;
- export CSV lato client.

### Backend

- Node.js + TypeScript;
- Express 5;
- architettura router → controller → service → model;
- Mongoose + MongoDB;
- DTO con `class-validator` e `class-transformer`;
- Passport, JWT, bcrypt;
- Nodemailer + SMTP;
- `dotenv`, `morgan`, `cors`, `body-parser`;
- `@dellacagna/iban` per gli IBAN;
- `tsx`, `nodemon`, `tsc`.

### Dati

- `ContoCorrente`
- `MovimentoContoCorrente`
- `CategoriaMovimento`
- `VerificaEmail`
- `Accesso`
- `AuditLog`

---

## 13. Criticità rispetto alle slide 1–12

Solo i punti che ricadono nel perimetro di questa prima parte:

1. **Configurazione non completamente esternalizzata**
   - Alcuni URL API sono hardcoded (`http://localhost:3000/...`).
   - La stringa di connessione al database è nel codice.
   - I segreti JWT non sono gestiti in modo uniforme.
   - Questo ostacola il passaggio da locale a IaaS/PaaS.

2. **Nessuna configurazione di deployment**
   - Non ci sono Dockerfile, pipeline CI/CD o manifest di deploy.
   - Non è quindi possibile dire oggi “questa API gira su PaaS” senza aggiungere configurazione.

3. **Scalabilità non dimostrata**
   - L’API è stateless e quindi potenzialmente scalabile.
   - Mancano load balancer, più istanze, health check e metriche.

4. **Prestazioni del database**
   - Mancano indici espliciti sulle query principali.
   - Con la crescita dei movimenti, la ricerca per conto e data può diventare costosa.

5. **Confini tra componenti non documentati**
   - Non esiste un diagramma di deployment o una descrizione dei nodi fisici.
   - La distinzione tra frontend, API, database ed email è deducibile dal codice, ma non formalizzata.

6. **Documentazione disallineata**
   - README e OpenAPI descrivono un’altra applicazione.
   - Per la restituzione al gruppo conviene produrre una documentazione autonoma, come questo file.

---

## 14. Decisioni da portare al gruppo (entro la slide 12)

1. **Dove eseguire l’API:** IaaS o PaaS?
2. **Dove pubblicare il frontend:** hosting statico/CDN o PaaS?
3. **Il database resta Atlas o viene spostato su una VM?** Se sì, cambia il modello di servizio.
4. **Come gestire la configurazione:** variabili d’ambiente, secret manager, URL relativi.
5. **Come scalare:** una sola istanza o più istanze dietro load balancer?
6. **Quali indici creare** per rendere sostenibili le query sui movimenti.
7. **Come documentare i nodi fisici** e i confini di rete.

---

## 15. Sintesi

- Il progetto è un **monolite modulare a tre livelli**: Angular per la presentazione, Express per la logica, MongoDB per i dati.
- I componenti sono già separati e comunicano tramite connettori chiari: HTTP/JSON, Mongoose e SMTP.
- L’architettura è **cloud-ready**, ma non ancora cloud-deployed: il database e le email sono servizi esterni, mentre frontend e backend girano in locale.
- Rispetto alle slide 1–12, la scelta più naturale è un deployment **PaaS** per l’API, con frontend statico e database gestito.
- Le regole del conto restano responsabilità del team: il modello di servizio cambia l’operatività, non la logica applicativa.

---

## Cosa resta fuori da questa analisi

Per rispettare il limite della slide 12, non sono stati trattati:

- serverless computing (slide 13);
- modelli di distribuzione public/private/hybrid/multi-cloud (slide 14);
- hybrid e multi-cloud (slide 15);
- costo totale di proprietà (slide 16);
- project work e modularità (slide 17–18);
- decisioni di migrazione (slide 19–20);
- consegna del gruppo e restituzione (slide 21–22);
- responsabilità condivisa (slide 23–24);
- identità e autorizzazione (slide 25);
- alta disponibilità, fault tolerance, disaster recovery (slide 26);
- replica, backup, RPO/RTO e prova di ripristino (slide 27–29);
- decisioni e controesempi (slide 30);
- scenari backup, cancellazione, conto altrui, due provider, servizio email (slide 31–35);
- risposta individuale e scelta per la lezione successiva (slide 36–37).
