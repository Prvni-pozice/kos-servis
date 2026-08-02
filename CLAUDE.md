# KOS servis — firemní web

Astro web pro **KOS servis s.r.o.** (Chyšná u Pacova, Vysočina) — strojní opravy,
zakázková kovovýroba a 3D pálení plazmou. Nahrazuje starý web na kos-servis.cz.

## Spuštění

```bash
nvm use 22          # Astro 7 vyžaduje Node >= 22.12
npm install
npm run dev         # http://116.203.103.27:4331/
npm run build
```

## Stack a rozhodnutí

- **Astro 7**, statický build s Vercel adaptérem (`output: 'static'`).
  Server běží jen kvůli jediné route `/api/poptavka` (`prerender = false`) —
  poptávkový formulář přijímá přílohy (výkresy, fotky) do 10 MB, což staticky nejde.
- **Fonty self-hostované** přes `@fontsource` (Archivo, IBM Plex Sans, IBM Plex Mono).
  Design systém je importoval z fonts.googleapis.com — na produkci to nechceme
  kvůli render-blocking requestu a GDPR.
- **CSS inline do HTML** (`inlineStylesheets: 'always'`) — žádný render-blocking request.
- **`trailingSlash: 'always'`** — kanonické URL i sitemapa musí sedět na jeden tvar.

## Struktura

```
src/data/site.ts          firemní údaje, lidé, stroje, reference — jediný zdroj pravdy
src/data/gallery.ts       čtení public/img/manifest.json pro galerie
src/content.config.ts     schéma kolekce služeb
src/content/sluzby/*.md   9 detailních stránek služeb
src/styles/
  design-system.css       převzato z claude.ai/design (projekt „KOS servis - industry")
  site.css                jen to, co design systém nepokrývá (mobilní menu, lightbox, hero)
src/pages/api/poptavka.ts SSR endpoint formuláře (nodemailer)
scripts/                  jednorázové importy médií, viz níže
```

## Design systém

Zdroj: **claude.ai/design → „KOS servis - industry"** (`503fce73-96ac-40c0-b3a4-d4ac80fc6d85`).
Barvy, typografie a komponentní třídy jsou odtud — **neměnit natvrdo**, vždy přes
tokeny (`var(--color-*)`, `var(--space-*)`).

Klíčová pravidla systému:

- Teplý akcent `--color-emergency` **je vyhrazený** pro CTA „Příjem oprav / Poptávka“
  a drobné čárky u eyebrow. Nikde jinde se nepoužívá — právě ta exkluzivita dělá
  kontakt viditelným.
- Nulové zaoblení, vlásková linka místo stínů, `.linegrid` jako hlavní layout.
- Data (parametry strojů, telefony, ceny) se sázejí v IBM Plex Mono.
- Žádné tmavé „industrial“ téma, žádné gradienty a stock fotky.

## Média

Fotky a videa nejsou v gitu generované — importují se skripty:

```bash
# 86 fotek ze starého webu (wget mirror kos-servis.cz)
node scripts/import-old-photos.mjs <cesta-k-mirroru-www.kos-servis.cz>

# 118 klientských fotek z Google Drive (HEIC → WebP)
node scripts/import-client-photos.mjs

# hero a kontaktní video z Drive: Full HD 20 Mbps → 720p bez zvuku + poster
node scripts/prepare-media.mjs <složka-se-zdrojovými-videi>
```

`public/img/manifest.json` vzniká z těchto skriptů a drží rozměry každé fotky,
aby `<img>` měl `width`/`height` a stránka při načítání neposkakovala.

**HEIC z iPhonu:** sharp je neotevře (libheif má limit na počet referencí
v dlaždicové mřížce). Proto se dekódují přes `heic-convert` a teprve výsledek
zpracuje sharp.

## Poptávkový formulář

`/api/poptavka` odesílá e-mail přes SMTP. Konfigurace je v proměnných prostředí
(`.env` lokálně, Vercel env na produkci) — viz `.env.example`.
**Přístupové údaje nikdy nepatří do gitu.**

Ochrany: honeypot pole, whitelist přípon, limit 5 souborů / 10 MB celkem,
strip řídicích znaků kvůli podvržení hlaviček. Do logu se nikdy nepíše obsah
poptávky ani SMTP heslo.

## Push zpět do design systému

Komponenty, které web má a design systém ne, se pushují zpět — jinak se obě strany
rozejdou. Zdroje jsou v `design-sync/components/`, postup a pravidla v
`/data/bot/DESIGN-CODE-PIPELINE.md`.

Zatím pushnuto: `gallery`, `timeline`, `breadcrumbs`, `navigation-mobile`, `form-states`.

## Dokumentace

Než začneš cokoliv odvozovat, přečti si tohle:

```
docs/zdroje-a-pristupy.md   všechna externí ID (design projekt, Google Docs,
                            4 Drive složky) a jak z nich stahovat
docs/rozhodnuti.md          odchylky od design systému a záludnosti, na kterých
                            se dá ztratit čas (trailingSlash vs API, CSRF u POST,
                            HEIC z iPhonu, headless chromium bez rootu)
docs/otevrene-body.md       co chybí, checklist před nasazením, co je hotové
docs/podklady-stary-web.md  texty a spec tabulky vytěžené z kos-servis.cz
```
