# Central Alabama Food Trucks

A collective for central Alabama's food-truck community:

- **Locate your food truck** — a live map (Leaflet + OpenStreetMap) of central Alabama showing each truck's current spot, today's hours, and whether it's open right now. _(defining feature)_
- **For vendors** — list your truck and find resources to get and stay compliant.
- **Book an event** — customers can request a truck for parties and private events.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling (brand tokens in `app/globals.css`)
- **react-leaflet** + **OpenStreetMap** tiles for the map (no API key required)
- Seeded truck data in `data/trucks.ts` (to be replaced by Supabase)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

| Path | Purpose |
| --- | --- |
| `data/trucks.ts` | Seeded truck records (name, cuisine, coords, weekly hours) |
| `lib/types.ts` | `Truck` / hours type definitions |
| `lib/hours.ts` | Open/closed status + schedule formatting |
| `components/TruckMap.tsx` | Leaflet map: custom pins, fit-bounds, fly-to (client-only) |
| `components/LocateExperience.tsx` | Map + interactive truck list with "Open now" filter |
| `components/Header.tsx`, `Footer.tsx` | Site chrome |
| `app/page.tsx` | Landing page (hero, locate, vendors, events) |

## Roadmap

- [ ] Move truck data to **Supabase** (Postgres + auth + realtime) so trucks can update their own live location.
- [ ] Vendor onboarding + compliance checklist flow.
- [ ] Event-request form wired to a backend/email.
- [ ] "Near me" geolocation to sort trucks by distance.

## Deploy

Deploys to **Vercel** out of the box (`npm run build` passes clean, fully static).
