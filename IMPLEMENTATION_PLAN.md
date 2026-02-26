# LEO Platform - Implementation Plan: "Vision 2026"

This plan outlines the architectural and UI upgrades required to transform LEO from a prototype into the comprehensive logistics ecosystem described in the Vision 2026 document.

## 🏗️ Phase 1: Database & Data Architecture (The "Event System")

LEO must transition from a static "parcel table" to a dynamic "event system."

- [ ] **Schema Expansion (`schema.sql`):**
    - Create `companies` table (DPD, DHL, InPost, etc.).
    - Create `courier_profiles` to handle multi-company registration.
    - Create `recipient_profiles` (IPO) with metadata for:
        - Intercom codes, entrance instructions, floor numbers.
        - Plan B preferences (Neighbor, Locker, Safe place).
    - Create `package_events` log (Scanning, Start Route, Plan B Triggered).
    - Add `delivery_window_start` / `delivery_window_end` (15-min slots).
    - Add `company_id` to `packages` for multi-operator routing.

## 🚚 Phase 2: Courier App - Operational Excellence

Transform the courier experience into an automated, zero-friction loop.

- [ ] **Onboarding & Multi-Company:**
    - New registration flow to select one or multiple carriers.
- [ ] **Route Management (`/courier/day`):**
    - Implement the "Stabilize Route" logic (System Proposes -> Courier Adjusts -> Plan Generated).
    - Calculation of 15-min slots based on traffic and average "at-door" time.
- [ ] **The Scanner & Entry:**
    - "Quick Add" form (Address + Phone).
    - OCR/Camera Scanning placeholder implementation.
- [ ] **Automation Panel:**
    - Replace manual chats with "Command Buttons":
        - `START ROUTE` (Triggers 15-min notifications).
        - `PLAN B REQUEST` (Asks customer for decision).
        - `LATE` (Recalculates following windows).

## 🙎‍♂️ Phase 3: Customer App & IPO (The "Uber Effect")

Focus on precise communication and self-service decisions.

- [ ] **IPO Onboarding:**
    - "Set up your profile" flow to save entrance codes and Plan B rules.
- [ ] **Interactive Live Tracking (`/customer/live`):**
    - "15 min before" activation logic.
    - Simplified Decision Panel: "I'm home", "Use Plan B", "Change to Locker".
- [ ] **Event-Driven UI:**
    - Status updates that show "System knows..." (IPO-integrated hints).

## 📡 Phase 4: Sztab Generalny (General Staff Panel)

A high-level dashboard for managing the "Macro City."

- [ ] **Live Map Layer:**
    - Visualization of all active routes.
    - Color-coding for "Risk" (Probability of missing a 15-min window).
- [ ] **Operational Cockpit:**
    - Heatmaps for "At-door time" and "Failed deliveries."
    - "Volume Broker" recommendation engine (Manual triggers for MVP).

## 🚛 Phase 5: Partner Flotowy (Fleet Manager Panel)
Operational management for sub-contractors with multiple vehicles.

- [ ] **Fleet Day KPI Dashboard:**
    - Real-time tracking of COD (Pobrania), Quality, and Efficiency.
- [ ] **Exception Control Center:**
    - Grouped alerts for breakdowns, traffic, and address issues.
- [ ] **Inter-Fleet Transfers:**
    - UI to shift packages between couriers in 2 clicks.
- [ ] **Competence Mapping:**
    - "Mój rejon" integration to show which courier excels in specific zones.

## 🛠️ Phase 6: Routing & Time Engine

Implementation of core logistics algorithms.

- [ ] **Window Engine:**
    - Logic to propagate delays throughout the day.
    - Automatic push notifications on window shifts.

---

## 🚦 Implementation Order

1.  **DB Upgrade:** Migrating the schema to support IPO and Multi-company.
2.  **Courier Route Control:** Implementing the reordering and window generation.
3.  **Customer Decision Panel:** Allowing customers to trigger Plan B.
4.  **Sztab Generalny Map:** Visualizing the routes.
