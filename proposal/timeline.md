# Timeline

**Proposta in risposta a RFP #MC-2026-0417**

---

## Piano di consegna — 8 settimane

Stimiamo una consegna completa dei requisiti R1–R4 in **8 settimane** dall'assegnazione del contratto, con inizio entro 10 giorni lavorativi dalla firma.

### Fase 1 — Analisi e onboarding (Settimane 1–2)

| Attività | Output |
|---|---|
| Analisi diretta del codebase | Inventario tecnico: componenti, endpoint, debito tecnico |
| Kick-off con team Meridian | Lista completa bug R1 concordata, accesso ambiente confermato |
| Architettura documentata (R4) | `architecture.html` — diagramma interattivo consegnato a IT |
| Setup infrastruttura test (R3) | Playwright configurato, primo test smoke su ambiente locale |

> **Milestone:** Architettura consegnata entro fine settimana 2. IT ha il documento prima che inizino le modifiche al codice.

---

### Fase 2 — Reports remediation (Settimane 3–4)

| Attività | Output |
|---|---|
| Fix di tutti i difetti R1 | Modulo Reports funzionante e stabile |
| Test E2E su Reports (R3) | Copertura completa del modulo nel test suite |
| Review con team Meridian | Sign-off su R1 prima di procedere |

> **Milestone:** R1 chiuso con test. IT sblocca le modifiche future.

---

### Fase 3 — Restocking feature (Settimane 5–7)

| Attività | Output |
|---|---|
| Sviluppo endpoint `/api/restocking` | Logica di raccomandazione con budget ceiling |
| Sviluppo vista Vue Restocking (R2) | Nuova view integrata nel dashboard |
| Test E2E su Restocking + moduli residui (R3) | Suite completa su tutti i moduli principali |
| Demo intermedia con R. Tanaka | Feedback operativo incorporato prima della chiusura |

> **Milestone:** R2 e R3 chiusi entro fine settimana 7.

---

### Fase 4 — Chiusura e desiderata (Settimana 8)

| Attività | Output |
|---|---|
| Bugfix e stabilizzazione finale | Tutti i required completati e verificati |
| D1/D2/D3 nella misura del budget residuo | Dipende dall'effort delle fasi precedenti |
| Documentazione finale e handoff | Consegna pacchetto completo al team IT |

> **Milestone finale:** Consegna completa — R1–R4 verificati, desiderata nella misura concordata.

---

## Riepilogo milestone

| Settimana | Milestone |
|---|---|
| 2 | R4 — Architettura consegnata a IT |
| 4 | R1 — Reports stabile con test, sign-off Meridian |
| 7 | R2 — Restocking in produzione; R3 — Suite test completa |
| 8 | Consegna finale, handoff, chiusura engagement |

---

## Note

- Le stime assumono accesso all'ambiente entro 5 giorni lavorativi dall'assegnazione (A6).
- La Fase 3 include una demo intermedia con R. Tanaka — il suo feedback operativo è incorporato prima della chiusura, non dopo.
- Il budget residuo a fine Fase 3 determina l'ampiezza dei desiderata (D1–D3) in Fase 4. Se le fasi precedenti rientrano nelle stime, D2 (i18n Tokyo) è realizzabile entro lo stesso contratto.
