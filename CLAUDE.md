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
- **Fonty self-hostované a osekané na češtinu** (Archivo, IBM Plex Sans, IBM Plex Mono),
  generuje `scripts/subset-fonts.mjs`. Design systém je importoval
  z fonts.googleapis.com — na produkci to nechceme kvůli render-blocking requestu
  a GDPR. Podrobnosti níže.
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

## Fonty

Generuje `scripts/subset-fonts.mjs` — stáhne plné TTF z Google Fonts, ořízne je na
znaky, které web potřebuje, a uloží po jednom souboru na řez do `src/styles/fonts/`
(9 souborů, ~110 kB; přes `@fontsource` to bylo 16 souborů a 260 kB, protože latin
a latin-ext jsou tam zvlášť). Vedle toho vypíše `src/styles/fonts.js` se seznamem
řezů — soubory jsou v `src/`, aby jim Vite dal hash a trvalou cache.

```bash
node scripts/subset-fonts.mjs           # přegeneruje fonty
node scripts/subset-fonts.mjs --check   # ověří, že dist/ nesází znak mimo subset
```

**`--check` pouštěj po každé větší změně textů.** Znak mimo subset se vykreslí
náhradním fontem, což je vidět, ale build to nenahlásí.

`@font-face` se **záměrně nevkládá do kritického CSS** — vkládá ho skript
v `BaseLayout.astro` až po `load`. Jinak si prohlížeč fonty vyžádá dřív než
poster v hero (to je LCP prvek) a mobilní Lighthouse spadne z 100 na 86.
Text je od začátku čitelný náhradním fontem (`font-display: swap`).

## Média

Fotky a videa nejsou v gitu generované — importují se skripty:

```bash
# 86 fotek ze starého webu (wget mirror kos-servis.cz)
node scripts/import-old-photos.mjs <cesta-k-mirroru-www.kos-servis.cz>

# 118 klientských fotek z Google Drive (HEIC → WebP)
node scripts/import-client-photos.mjs

# hero a kontaktní video z Drive: Full HD 20 Mbps → 720p bez zvuku + poster
node scripts/prepare-media.mjs <složka-se-zdrojovými-videi>

# fotky, které klient nahrál do složky review/ v repu (12 dorazilo, 6 se používá)
node scripts/import-review-photos.mjs

# logo dokreslené na servisní dodávky pro /kontakt/ (vozy zatím polepené nejsou)
python3 scripts/brand-vans.py
```

**`brand-vans.py` maluje do fotek něco, co ve skutečnosti není** — logo na bok
dodávky. Je to na výslovné přání klienta a v `docs/otevrene-body.md` je to vedené
jako dočasný stav. Originály se nepřepisují, výstup jde do
`public/img/servisni-dodavky/`. Souřadnice čtyřúhelníku pro logo jsou v měřítku
náhledu 900×675, protože podle něj se odměřovaly; skript si je přepočítá.
Náhled v galerii i zvětšenina v lightboxu čtou **týž soubor**, takže se nemůžou
rozejít.

`public/img/manifest.json` vzniká z těchto skriptů a drží rozměry každé fotky,
aby `<img>` měl `width`/`height` a stránka při načítání neposkakovala.

**Skladbu galerií nikdy needituj v manifestu ručně** – jediný zdroj pravdy je
`scripts/curate-galleries.mjs`. Fotky se v něm adresují pořadovým číslem ve
zdrojové sadě (`V(42)` = 42. z `firma-vyroba`), což jsou přesně čísla
z kontaktních archů, podle kterých se vybírá:

```bash
node scripts/curate-galleries.mjs   # přepíše sekce sl-*, reference-galerie, …
```

Pravidla, která z toho plynou (připomínky klienta z 18. 8. 2026):

- **Devět nebo dvanáct fotek na galerii**, ne dvacet. Počet musí dělit tři,
  jinak zůstane v poslední řadě prázdné pole.
- **Tematický výběr, minimální překryv.** Pálicí centrum je buď na strojovém
  parku, nebo na detailu pálení – ne na obou. Opakování stejných snímků na
  třech stránkách po sobě bylo to, co klientovi vadilo.
- **`/reference/` = jen hotové výrobky a opravené díly**, žádný náš stroj.
- **`/strojovy-park/` = jedna fotka ke každému stroji z přehledu**, s popiskem
  (`caption` v manifestu). Bez popisku galerie ten požadavek nesplní.

**HEIC z iPhonu:** sharp je neotevře (libheif má limit na počet referencí
v dlaždicové mřížce). Proto se dekódují přes `heic-convert` a teprve výsledek
zpracuje sharp.

## Poptávkový formulář

`/api/poptavka` odesílá e-mail přes **HTTP API Resendu** (`RESEND_API_KEY`,
`MAIL_FROM`, `MAIL_TO`) — ne přes SMTP. Serverless funkce žije krátce a navazovat
z ní SMTP spojení je pomalé a nespolehlivé. Konfigurace je v proměnných prostředí
(`.env` lokálně, Vercel env na produkci) — viz `.env.example`.
**Přístupové údaje nikdy nepatří do gitu.**

**Proměnné se čtou z `process.env`, ne z `import.meta.env`.** Vite zapeče
`import.meta.env` do bundlu už při buildu — hodnoty nastavené v dashboardu
Vercelu by se přes něj za běhu nikdy nenačetly a formulář by vracel 500, i když
by v projektu byly správně vyplněné. `import.meta.env` zůstává jen jako záloha
pro lokální `.env`. Ověřeno: bez proměnných 500, s proměnnými se request dostane
až k Resendu.

`MAIL_FROM` musí být na doméně ověřené v Resendu, jinak Resend zprávu odmítne.
Doména `kos-servis.cz` má vlastní poštu u Avatechu a SPF končí `-all`, takže se
ověřuje **subdoména** `send.kos-servis.cz` — stávající poštu to nechá být.

Ochrany: honeypot pole, whitelist přípon, limit 5 souborů / 4 MB celkem,
strip řídicích znaků kvůli podvržení hlaviček. Do logu se nikdy nepíše obsah
poptávky ani API klíč.

**Strop 4 MB drží Vercel, ne my** — serverless funkce nepřijme request větší
než 4,5 MB a vrátí 413 dřív, než se route spustí. Limit je proto na třech
místech (`MAX_TOTAL_BYTES` v route, `MAX_BYTES` a popisky v `InquiryForm.astro`)
a musí zůstat sladěný. Větší přílohy by znamenaly nahrávat soubory mimo tuhle route.

## Push zpět do design systému

Komponenty, které web má a design systém ne, se pushují zpět — jinak se obě strany
rozejdou. Zdroje jsou v `design-sync/components/`, postup a pravidla v
`/data/bot/DESIGN-CODE-PIPELINE.md`.

Zatím pushnuto: `gallery`, `timeline`, `breadcrumbs`, `navigation-mobile`, `form-states`.

## Předávací kontrola

Před odesláním webu klientovi spusť skill `pre-launch-review` (katalog je
v `/data/bot/vps-setup/skills/`). Poslední běh: 2. 8. 2026, výsledky v `review/`.

Dvě věci z něj platí trvale:

- `node scripts/subset-fonts.mjs --check` po každé změně textů — ohlásí znak,
  který v subsetu fontu chybí.
- Kontrola vodorovného přetečení na šířkách 375–1920 px. Hero mělo pevnou šířku
  933 px a na běžném monitoru to nebylo vidět; chyby se schovávají mezi breakpointy.

## Česká typografie

Nezlomitelné mezery a pomlčky řeší `scripts/typo-cz.mjs` jako krok po buildu —
sahá jen na textové uzly hotového HTML, ne na značky, atributy ani skripty.
**Do zdrojů `&nbsp;` nepiš**, rozsypané po třiceti souborech to nikdo neudrží.
Pravidla: předložky k s v z o u a i, číslo + jednotka, tisíce, telefony, zkratky,
rozsahy bez mezer a em dash → pomlčka.

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
