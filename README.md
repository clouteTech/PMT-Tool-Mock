# ENVISION – Project Management Portal v2.1

**Angular 20 · PrimeNG 20 · PrimeFlex 3.x · Tailwind CSS 3.x**

## What's Included

### 🔐 Login Screen (Split Screen)
- **Left panel:** Real Envision logo (envision-group-vector-logo.png), gradient background, stats cards
- **Right panel:** Clean login form with validation
- Credentials: `siteengineer_user1` / `123456`
- Auth guard on all dashboard routes

### 🏠 Dashboard (Demand Plan)
- Original look preserved — no visual changes
- PrimeNG TableModule imported for table support
- Sidebar toggle, logout confirmation all working

### ➕ Create Project (New Menu)
Added to sidebar under "PMO" group:

**Step 1 — Project Details:**
P Code, F Code, Description, Client, State, WTG, Capacity, Owner, Project Manager,
State Head, Construction Manager, Location, WTG Coordinates, Plan Date

**Step 2 — Plans (5 Accordion panels with p-table headers):**
1. Supply Plan (Anchor Cages, Nacelle, Hub, Blade, Tower, Converter Panel, Accessories)
2. Service Plan (Foundation, Installation, Pre-Commissioning, Commissioning, STPT, etc.)
3. Manpower Plan (PM, Site Manager, Engineers, Commissioning, Civil, EHS)
4. Tools Plan (Unloading, Rotor Lifting, Blade Lifting, Hydraulic, Cable, Generator Alignment, Sub-Contract)
5. Frame Return Plan (Nacelle, Hub, Blade, Tower)

All accordion headers use `p-table` (PrimeNG) as requested.
All date pickers use `p-datepicker` with `appendTo="body"`.
All dropdowns use `p-select`.
Minimal custom CSS — relies on PrimeFlex utility classes.

### 🖼️ Logos
- **Login screen:** `assets/envision-logo.png` (envision-group-vector-logo.png)
- **Topbar:** `assets/envision-logo.png`
- **Favicon:** `public/favicon.png` (EnvisionLogo_1.png — dark swirl icon)

## Run

```bash
npm install
ng serve
# Open http://localhost:4200
```

## File Structure

```
src/
├── assets/
│   ├── envision-logo.png       ← Full color Envision logo (login + topbar)
│   └── envision-favicon.png    ← Dark swirl icon (reference)
├── public/
│   └── favicon.png             ← Dark swirl icon (browser tab favicon)
└── app/
    ├── auth/                   ← auth.service.ts, auth.guard.ts
    ├── login/                  ← Split-screen login
    ├── demand-plan/            ← Original demand plan (unchanged visually)
    ├── create-project/         ← New Create Project screen
    ├── app.component.*         ← Shell with topbar, sidebar, logout confirm
    └── app.routes.ts
```
