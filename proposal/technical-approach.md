# Technical Approach

**Proposta in risposta a RFP #MC-2026-0417**

---

## Metodologia generale

Il nostro punto di partenza è il codice reale, non la documentazione del vendor precedente — che abbiamo già esaminato e che risulta incompleta. La prima attività dell'engagement sarà un'analisi diretta del codebase per validare le assunzioni di scope. Il nostro ciclo di lavoro è: analisi → fix → test → documentazione → nuove funzionalità. Ogni consegna è verificata con test automatizzati prima di essere considerata chiusa.

---

## R1 — Remediation del modulo Reports

Il modulo Reports è stato dichiarato "in progress" al termine del contratto precedente e non è mai stato consegnato in stato funzionante. Il nostro approccio:

1. **Audit sistematico** — Revisione completa del codice Vue del modulo e degli endpoint FastAPI corrispondenti. La lista completa dei difetti sarà confermata e concordata con il team Meridian nella sessione di kick-off.

2. **Risoluzione dei difetti noti** — Inclusi, ma non limitati a:
   - Filtri non cablati o con comportamento inconsistente
   - Gap di internazionalizzazione (testi non tradotti, formati non localizzati)
   - Inconsistenze nei pattern API (componenti in Options API da migrare a Composition API)

3. **Verifica** — Ogni fix viene coperto da test automatizzati (vedi R3) prima della chiusura. Nessun bug dichiarato risolto senza test di regressione.

*Assunzione: la lista completa degli 8+ bug noti sarà confermata al kick-off. Bug aggiuntivi scoperti durante l'audit rientrano nello scope.*

---

## R2 — Restocking recommendations

Nuova vista integrata nel dashboard esistente — stessa architettura Vue/FastAPI, nessun sistema separato.

**Backend:**
- Nuovo endpoint `GET /api/restocking` che calcola raccomandazioni d'acquisto combinando:
  - Stock attuale per magazzino e categoria (`/api/inventory`)
  - Previsione della domanda (`/api/demand`)
  - Budget ceiling fornito dall'operatore come parametro
- Logica di prioritizzazione: articoli con stock critico e alta domanda prevista vengono raccomandati per primi, nei limiti del budget disponibile

**Frontend:**
- Nuova view Vue con:
  - Input budget (per magazzino o globale)
  - Tabella raccomandazioni: articolo, magazzino, quantità suggerita, costo stimato
  - Indicatore di budget residuo in tempo reale
- Stessa struttura di filtri e layout delle viste esistenti per coerenza con l'interfaccia attuale

*Assunzione: i dati di stock e domanda necessari sono già esposti dalle API esistenti. Eventuali gap nei dati saranno identificati durante l'analisi e concordati con il team operativo.*

---

## R3 — Test automatizzati E2E

Il team IT di Meridian ha bloccato le modifiche al sistema in assenza di test. R3 non è un nice-to-have — è il prerequisito operativo per rendere sostenibile qualunque cambiamento futuro.

**Tecnologia:** Playwright — standard di mercato per test browser E2E, supportato da tutti i principali CI/CD.

**Scope di copertura** (tutti i moduli principali):
- Inventory — filtri per magazzino e categoria, visualizzazione dati
- Orders — filtri per stato, periodo, magazzino; visualizzazione ordini
- Spending — riepilogo spese, breakdown per categoria
- Reports — tutti i filtri, correttezza dei dati visualizzati (post-remediation R1)
- Restocking — input budget, generazione raccomandazioni, aggiornamento in tempo reale (post-build R2)

**Deliverable:** suite di test eseguibile autonomamente dal team IT, con documentazione su come aggiungerli e mantenerli.

---

## R4 — Documentazione architetturale

Produrremo un documento architetturale aggiornato basato sull'analisi diretta del codice, non sul handoff del vendor precedente (che risulta incompleto e potenzialmente non aggiornato).

**Contenuto:**
- Diagramma dei componenti: frontend Vue, backend FastAPI, layer dati (file JSON in `server/data/`)
- Flusso dati: dai filtri UI all'API fino alla risposta — inclusi i pattern di reattività Vue
- Inventario degli endpoint API con parametri e formati di risposta
- Note sui pattern tecnici utilizzati e sulle aree di debito tecnico residuo

**Formato:** HTML interattivo — leggibile nel browser, facile da aggiornare, adatto al passaggio di consegne al team IT interno.

---

## D1–D3 — Requisiti desiderati

Affronteremo i desiderata nella misura consentita dal budget concordato, con il seguente ordine di priorità:

- **D2 — Internazionalizzazione:** Estensione del supporto i18n ai moduli ancora in inglese, con priorità al giapponese per il team di Tokyo (12 persone, proficiency variabile in inglese). Questo requisito ha impatto diretto sull'operatività quotidiana di un intero warehouse.

- **D1 — UI modernization:** Refresh visivo basato su standard di mercato (Tailwind CSS o equivalente). Nessun design system proprietario richiesto — proporremo un'opzione durante la fase di analisi per approvazione prima dell'implementazione.

- **D3 — Dark mode:** Tema selezionabile dall'operatore, particolarmente utile per le postazioni in ambienti a bassa luminosità. Tecnicamente implementabile come estensione del sistema di design token già presente nel codebase.

---

## Assunzioni

| # | Assunzione |
|---|---|
| A1 | Budget di progetto: $80–120k |
| A2 | Scope test E2E: tutti i moduli principali (Inventory, Orders, Spending, Reports, Restocking) |
| A3 | Standard UI: standard di mercato, nessun design system interno da rispettare |
| A4 | Lista completa bug R1 da confermare al kick-off con il team Meridian |
| A5 | Dati di stock e domanda esistenti sufficienti per la logica di restocking (da verificare in analisi) |
| A6 | Ambiente di sviluppo accessibile entro 5 giorni lavorativi dall'assegnazione del contratto |
