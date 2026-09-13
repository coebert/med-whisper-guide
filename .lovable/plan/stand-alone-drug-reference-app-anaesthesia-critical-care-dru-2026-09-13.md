# Stand-alone Drug Reference App — "Anaesthesia & Critical Care Drugs"

Port the drug reference feature out of the **Anaesthetic Insights** project into this new project as a stand-alone app.

## What exists today (confirmed in the source project)

- A self-contained feature folder `src/features/drugReference/` (6 files, ~800 lines: layout, types, topics, dilutions, offline cache, data hooks) — deliberately written to be lifted out.
- Nine pages under `src/pages/reference/` (~1,600 lines): home, drug library, drug monograph, topics, monitoring (TDM), infusions, calculator, about.
- One shared data file it depends on: `src/data/icuInfusions.ts` (357 lines).
- A public `drugs` table in the backend with a read-for-everyone policy.
- **208 drug monographs** already exported from the existing app (public read access) and saved locally, ready to seed into the new app.

## Plan

### 1. Backend (Lovable Cloud)
- Enable Lovable Cloud on this project.
- Create the `drugs` table (same columns as the source: slug, name, class, synonyms, doses, infusion ranges, mechanism, pharmacokinetics, preparation, monitoring, side effects, contraindications, interactions, TDM JSON, sources JSON), with public read-only access and no sign-in required.
- Seed all **208 monographs** into the new database as part of the setup, so the app is complete from first launch.

### 2. Port the app code
- Copy `src/features/drugReference/`, `src/data/icuInfusions.ts` and the nine reference pages into this project.
- Adapt to this project's framework (TanStack Start):
  - `react-router-dom` Links/params → TanStack Router file routes and navigation
  - `react-helmet-async` → per-route head metadata (unique title/description per page for search engines)
- Routes (drop the `/reference` prefix since this is now the whole app):
  - `/` — home
  - `/drugs` — searchable A–Z library
  - `/drugs/$slug` — full monograph page
  - `/topics` and `/topics/$slug` — drug classes/topics
  - `/monitoring` — drugs needing therapeutic drug monitoring
  - `/infusions` — standard infusion recipes
  - `/calculator` — infusion dose calculator
  - `/about` — sources, disclaimer, offline-cache controls

### 3. Branding and polish
- Name the app **Anaesthesia & Critical Care Drugs** throughout (titles, header, metadata).
- Keep the feature's existing clean layout; align colours/typography with a single distinctive clinical reference style.
- Keep the offline caching behaviour (monographs cached on device, offline indicator).

### 4. Verify
- Build passes, every route loads, search works, monograph pages render all sections, calculator computes correctly with real data.
- Spot-check several drugs against the source app for content parity.

## Notes / decisions
- **No login needed** — the reference is read-only and public, same as in the source app.
- The original Anaesthetic Insights app is untouched; this is a copy, not a move. Removing the feature from the original app is a separate task you can request there later if you want.
- Content edits going forward would be made in this new app's database.

## Technical details (for reference)
- Stack: TanStack Start + Tailwind v4 + Lovable Cloud (Supabase under the hood).
- Data reads: browser Supabase client against a `TO anon` public SELECT policy (RLS enabled), matching the source app's public-access model; explicit GRANTs included in the migration.
- Seed: literal `INSERT` statements for all 208 rows inside the migration, generated from the verified export (`/tmp/drugs.json`).
