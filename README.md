# Autoservis Petr Tuček – web

Prémiový, rychlý web autoservisu (Mapetoucan cars s.r.o., provozovna Malešovice 113).

**Stack:** [Astro 7](https://astro.build) · Tailwind CSS 4 · TypeScript · Vercel (statické stránky + 1 serverless endpoint) · Resend (e-maily z formuláře).

## Spuštění

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # produkční build (.vercel/output)
npx astro check    # typová kontrola
```

Vyžaduje Node.js ≥ 22.

## Struktura

| Cesta | Obsah |
| --- | --- |
| `src/config/site.ts` | **Jediný zdroj údajů o firmě** – kontakty, adresa, otevírací doba, sociální sítě, mapy |
| `src/content/sluzby/*.md` | Služby (texty, fotka, body „v kostce“) – z nich se generují karty i podstránky `/sluzby/…` |
| `src/data/reviews.ts` | Skutečné recenze (prázdné = sekce se na produkci nezobrazí) |
| `src/data/gallery.ts` | Fotky v galerii |
| `src/components/` | Sekce webu (Hero, Services, Specialization, WhyUs, Process, About, Reviews, Gallery, Contact…) |
| `src/styles/global.css` | Design systém – barvy, typografie, tlačítka, animace |
| `src/lib/booking/` | Zpracování objednávek (validace, rozhraní `BookingProvider`, implementace Resend) |
| `src/pages/api/booking.ts` | Serverless endpoint formuláře |
| `src/assets/brand/` | Logo (SVG, text převedený na křivky; černé části = `currentColor`) |
| `brand/` | Originální podklady od klienta (logo, fotky) |

## Design systém

- Barvy: černá/grafit (`ink-*`), šedé (`steel-*`), světlá sekce (`paper`), akcent z loga `brand` = `#9E1825`
  (světlejší `brand-400/500` pro text a detaily na tmavém pozadí kvůli kontrastu).
- Písma: Barlow Condensed (nadpisy) + Inter (text), self-hosted přes Fontsource.
- Animace: CSS + malý IntersectionObserver skript (`src/scripts/ui.ts`), respektují `prefers-reduced-motion`.

## Objednávkový formulář

Formulář posílá `POST /api/booking` (JSON s JS, klasický POST bez JS → přesměrování na `/dekujeme` nebo `/objednavka-chyba`).
Validace je sdílená (zod na serveru, lehké validátory v prohlížeči), obsahuje honeypot a jednoduchý rate-limit.

**Konfigurace (Vercel → Settings → Environment Variables)** – viz `.env.example`:
`RESEND_API_KEY`, `BOOKING_TO_EMAIL`, `BOOKING_FROM_EMAIL` (doména odesílatele musí být ověřená v Resendu).
Bez nich formulář **nepředstírá úspěch** – zobrazí, že online objednávky zatím nejsou aktivní, a nabídne telefon.

**Budoucí rezervační systém:** stačí přidat novou implementaci `BookingProvider` v `src/lib/booking/providers/`
(např. Reservio, Cal.com nebo vlastní DB) a zaregistrovat ji v `src/lib/booking/index.ts` + `BOOKING_PROVIDER`.

## SEO

Title/description pro každou stránku, canonical, Open Graph, `sitemap-index.xml`, `robots.txt`,
JSON-LD `AutoRepair` (adresa, GPS, otevírací doba, telefony, IČO/DIČ, oblast působnosti) a `Service` + `BreadcrumbList` na podstránkách.

## Nasazení (Vercel)

1. Importovat repozitář do Vercelu (framework se detekuje automaticky).
2. Nastavit proměnné z `.env.example` (včetně `PUBLIC_SITE_URL`).
3. Připojit doménu.

## TODO – doplnit od klienta

- [ ] **Fotky** – nahradit placeholdery v `src/assets/placeholder/` reálnými fotkami dílny, týmu a prací
      (stačí soubor se stejným názvem, nebo upravit importy). Placeholdery pochází z [Unsplash](https://unsplash.com/license).
- [ ] **E-mail servisu** → `site.email` v `src/config/site.ts`
- [ ] **Otevírací doba** – ověřit (nyní předpoklad Po–Pá 9:00–18:00, víkend zavřeno)
- [ ] **Sociální sítě / Google profil** → `site.social`
- [ ] **Text „O nás“** – skutečný příběh a tým (`src/components/About.astro`)
- [ ] **Rozsah služeb** – ověřit texty v `src/content/sluzby/*.md` (každý soubor má poznámku TODO)
- [ ] **Recenze** – vložit skutečné recenze do `src/data/reviews.ts`
- [ ] **Doména** – `PUBLIC_SITE_URL` (výchozí `https://www.autoservis-tucek.cz` je jen předpoklad)
- [ ] **Zásady ochrany osobních údajů** – nechat zkontrolovat (`src/pages/ochrana-osobnich-udaju.astro`)
