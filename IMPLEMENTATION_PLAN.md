# LEO Platform — Architektura i Plan Implementacji
## Vision 2026 MVP · Next.js 14 + Supabase + Mapbox

---

## KROK 1: Schemat bazy danych — ZAKTUALIZOWANY ✅

Nowy `schema.sql` zawiera:

| Tabela | Opis | Realtime? |
|---|---|---|
| `profiles` | Rozszerzenie auth.users (kurier, klient, dyspozytor) | ❌ |
| `companies` | Operatorzy logistyczni (DPD, DHL, LEO Direct) | ❌ |
| `sectors` | Rejony doręczeń (WWA-WOLA-01 etc.) | ❌ |
| `routes` | Trasy dzienne kurierów (LEO Engine output) | ❌ |
| `ipo_profiles` | Inteligentny Profil Odbiorcy + Plan B | ❌ |
| `packages` | Paczki z pełnym state machine (15 statusów) | ❌ |
| `package_events` | Event stream (immutable log) | ✅ **REALTIME** |
| `courier_locations` | GPS beacon kuriera (upsert co 5s) | ✅ **REALTIME** |
| `address_intelligence` | Nagromadzone dane o adresach | ❌ |
| `exceptions` | Kolejka wyjątków dla dyspozytora | ❌ |
| `sector_scores` | Wyniki/gamifikacja kurierów | ❌ |

**RLS Policies:** Każda tabela ma szczegółowe polityki widoczności (kurier widzi swoje, klient widzi swoje, dyspozytor widzi wszystko).

---

## KROK 2: Struktura katalogów Next.js 14 (App Router)

```
leo-core/
├── app/
│   │
│   ├── (auth)/                         # Shared auth group
│   │   ├── login/page.tsx              ⚠️ TODO
│   │   └── layout.tsx
│   │
│   ├── courier/                        # APLIKACJA KURIERA
│   │   ├── day/page.tsx                ✅ DONE — Lista paczek + Plan/Mapa/Inbox
│   │   ├── route/page.tsx              ⚠️ TODO — Mapa Mapbox + drag&drop kolejność
│   │   ├── stop/[id]/page.tsx          ✅ DONE — Widok pojedynczego stopu
│   │   ├── stop/[id]/scan/page.tsx     ⚠️ TODO — ZXing scanner
│   │   ├── stop/[id]/exception/page.tsx ⚠️ TODO — Zgłaszanie wyjątku
│   │   ├── region/page.tsx             ⚠️ TODO — Rejon i wyniki dzienne
│   │   ├── messages/page.tsx           ✅ DONE — Inbox
│   │   ├── onboarding/page.tsx         ✅ DONE
│   │   └── profile/page.tsx            ⚠️ TODO
│   │
│   ├── customer/                       # APLIKACJA KLIENTA
│   │   ├── packages/page.tsx           ✅ DONE — Lista + Mapa punktów + Zwroty
│   │   ├── live/page.tsx               ✅ DONE — Live tracking (Mapbox fullscreen)
│   │   ├── account/page.tsx            ⚠️ TODO — IPO + Plan B settings
│   │   ├── onboarding/page.tsx         ⚠️ TODO
│   │   └── profile/page.tsx            ⚠️ TODO
│   │
│   ├── dispatch/                       # PANEL DYSPOZYTORA (Desktop)
│   │   ├── page.tsx                    ✅ DONE — Sztab Generalny (Mapa + Wyjątki)
│   │   └── fleet/page.tsx              ✅ DONE — Partner Flotowy
│   │
│   ├── ops/page.tsx                    ✅ DONE — Dyspozytor mobilny
│   ├── cx/page.tsx                     ✅ DONE — CX Support
│   ├── exec/page.tsx                   ✅ DONE — Panel zarządu
│   ├── engineering/page.tsx            ✅ DONE
│   ├── warehouse/mobile/page.tsx       ⚠️ TODO
│   └── page.tsx                        ✅ DONE — Landing / Role selector
│
├── components/
│   ├── LEOMap.tsx                      ✅ DONE — Mapbox wrapper (tactical/consumer)
│   ├── ui/                             ✅ DONE — shadcn button, card
│   ├── ZXingScanner.tsx                ⚠️ TODO — QR/Barcode scanner
│   ├── RealtimeProvider.tsx            ⚠️ TODO — Supabase Realtime context
│   ├── DeliveryWindow.tsx              ⚠️ TODO — 15-min countdown widget
│   └── PlanBModal.tsx                  ⚠️ TODO — Unified Plan B selection
│
├── lib/
│   ├── supabaseClient.ts               ✅ DONE
│   ├── utils.ts                        ✅ DONE
│   ├── leo-engine.ts                   ⚠️ TODO — Obliczanie okien 15-min
│   ├── fcm.ts                          ⚠️ TODO — Firebase push notifications
│   └── address-intelligence.ts        ⚠️ TODO — Normalizacja adresów
│
├── app/api/                            # Next.js API Routes (LEO Engine)
│   ├── leo-engine/
│   │   ├── calculate-route/route.ts    ⚠️ TODO — Mapbox Matrix API
│   │   └── recalculate-windows/route.ts ⚠️ TODO — Po każdym opóźnieniu
│   ├── packages/[id]/
│   │   ├── deliver/route.ts            ⚠️ TODO — POST: potwierdź doręczenie
│   │   └── plan-b/route.ts             ⚠️ TODO — POST: aktywuj Plan B
│   └── webhooks/
│       └── przelewy24/route.ts         ⚠️ TODO — COD payment callback
│
├── schema.sql                          ✅ UPDATED — Pełny schema v2
├── .env.local                          ✅ DONE
└── package.json                        ✅ DONE
```

---

## KROK 3: Mapa zależności (co od czego zależy)

```
[Supabase Auth] → [profiles table]
                ↓
         [packages table] ← [routes table] ← [LEO Engine API]
                ↓                                    ↑
      [package_events]  ←—————— Courier App ————————┘
           ↓
    [Supabase Realtime] → [Customer App: live tracking]
                       → [Dispatcher: exception queue]
                       → [FCM: push "15 min before"]
```

---

## KOLEJNOŚĆ IMPLEMENTACJI (Rekomendacja)

### Sprint 1 — Rdzeń operacyjny (kurier)
1. **ZXingScanner** — skanowanie paczek w `courier/stop/[id]/scan/`
2. **`package_events` INSERT** — logowanie zdarzeń (scanned, at_door, delivered)
3. **Supabase status update** — po każdym zdarzeniu aktualizuj `packages.status`

### Sprint 2 — Event-Driven Core
4. **RealtimeProvider** — Supabase Realtime subscription na `package_events`
5. **DeliveryWindow** — widget odliczający do okna 15-min (dla klienta)
6. **Push notification** — FCM "15 min before" triggered by `approaching_15min` event

### Sprint 3 — LEO Engine
7. **`/api/leo-engine/calculate-route`** — Mapbox Matrix API → kolejność stops
8. **`/api/leo-engine/recalculate-windows`** — po opóźnieniu aktualizuj okna i wywołaj eventy

### Sprint 4 — Płatności i Zwroty
9. **Przelewy24 + BLIK** — COD flow w aplikacji klienta
10. **Label-less Return** — generowanie kodu zwrotu

---

## PYTANIE DO CIEBIE:

Od czego zaczynamy szczegółowy kod?

- **A) ZXingScanner** — integracja skanera QR/barcode w aplikacji kuriera
- **B) Supabase Realtime** — `RealtimeProvider`, live tracking, powiadomienia
- **C) LEO Engine API** — `/api/leo-engine/calculate-route` z Mapbox Matrix
- **D) Widok `courier/route`** — mapa z drag&drop i nawigacją
- **E) Auth flow** — logowanie kuriera/klienta z Supabase Auth i przekierowanie do odpowiedniej roli
- **F) Przelewy24** — integracja dla płatności COD/BLIK

