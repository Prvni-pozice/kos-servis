# Rozhodnutí a záludnosti

Věci, které z kódu nejsou vidět, ale při další práci se hodí vědět.
Stav k 2. 8. 2026.

## Odchylky od design systému

| Co | Proč |
|---|---|
| Vlastní subset fontů, ne `@import` z Google Fonts ani `@fontsource` | Design systém načítal fonty z fonts.googleapis.com. Na produkci to znamená render-blocking request na cizí doménu a GDPR problém. Úvodní strana teď nedělá jediný externí request. `@fontsource` byl mezikrok — dodává latin a latin-ext jako dva soubory, takže 9 řezů stálo 16 požadavků a 260 kB. Viz `scripts/subset-fonts.mjs`. |
| `.timeline` povýšena na třídy | Na `/o-firme/` byla původně inline styly. Před pushem do Designu se musela formalizovat, jinak by se obě strany rozešly. |
| Výplňová buňka v mřížce strojů | Šest strojů, z toho jeden přes dva řádky = 7 buněk ve třech sloupcích → dvě prázdná šedá pole. Doplněno CTA blokem, počet se dopočítává. |
| Teplý akcent i u letopočtu a chybové hlášky | Formálně porušuje pravidlo „akcent jen pro Příjem oprav". U chyby obhajitelné (stejná naléhavost), u letopočtu ke zvážení — poznámka je i v pushnuté komponentě. |

## Záludnosti, na kterých se dá ztratit čas

**`aspect-ratio` + `min-height` na stejném prvku přeteče stránku do boku.**
Minimum se podle specifikace přenese přes poměr i do druhé osy, takže
`aspect-ratio: 21/9; min-height: 400px` znamená i `min-width: 933px`. Hero měl
proto pevnou šířku a mezi ~700 a ~1000 px viewportu se stránka posouvala vodorovně
(na desktopu to nebylo vidět, protože 933 px zhruba odpovídá obsahové šířce).
Výška se teď počítá ručně — `.hero` v `site.css`, proměnné `--hero-ratio`
a `--hero-min`. Kontrolní skript na přetečení je v poznámkách k revizi.

**Fonty se vkládají až po `load`, ne v kritickém CSS.** Jinak si je prohlížeč
vyžádá dřív než poster v hero (LCP prvek) a mobilní Lighthouse spadne ze 100 na 86.
Detaily v `CLAUDE.md`, sekce Fonty.

**Poster videa se bere z hotového `mp4`, ne ze zdrojového souboru.** Je pak přesně
tím snímkem, který divák uvidí (přechod neblikne) a je menší — detail, který kodek
zahodil, není potřeba ukládat znovu.

**`trailingSlash: 'always'` rozbije API route.** Formulář musí posílat na
`/api/poptavka/` s lomítkem, jinak 404. Je to okomentované v `InquiryForm.astro`.

**Astro má CSRF ochranu na POST.** Testy endpointu přes `curl` potřebují hlavičku
`Origin` shodnou s hostem, jinak vrací 403 „Cross-site POST form submissions are forbidden":

```bash
curl -H "Origin: http://127.0.0.1:4331" -X POST http://127.0.0.1:4331/api/poptavka/ -F ...
```

**Astro 7 vyžaduje Node ≥ 22.12**, systémový je 20. Před každou prací:

```bash
nvm use 22
```

**HEIC z iPhonu sharp neotevře** — libheif má limit 16 referencí v `iref` boxu
a iOS fotky jich mají 48. `ffmpeg -map 0:g:0` vrací jen jednu dlaždici, ne celý
obraz. Funguje `heic-convert` → sharp, viz `scripts/import-client-photos.mjs`.

**Importní skripty sdílejí `public/img/manifest.json`.** `import-old-photos.mjs`
ho původně přepisoval celý a mazal tím sekce klientských fotek. Opraveno —
teď se doplňují jen vlastní klíče. Při úpravách to nerozbít znovu.

**Ve staré galerii je i logo webu.** Filtruje se podle rozměru zdroje (pod 600 px
na delší straně se přeskakuje), jinak leze do fotogalerií.

**Soubory pojmenované `sni-mek-obrazovky-*.png` NEJSOU screenshoty.** Jsou to
profesionální fotky vlastního stroje Messer OmniMat — nejlepší fotky, které
ze starého webu jsou. Nefiltrovat je pryč.

## Screenshoty bez rootu

Na serveru není chromium ani sudo. Postup, který funguje:

```bash
npm i playwright-core && npx playwright install chromium
cd <scratchpad>/libs
apt-get download libnspr4 libnss3 libatk1.0-0t64 libatk-bridge2.0-0t64 \
  libatspi2.0-0t64 libcups2t64 libdrm2 libxkbcommon0 libxcomposite1 \
  libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 \
  libpangocairo-1.0-0 libgtk-3-0t64 libgdk-pixbuf-2.0-0 libxext6 libxi6 libxrender1
for d in *.deb; do dpkg-deb -x "$d" root; done
export LD_LIBRARY_PATH="$PWD/root/usr/lib/x86_64-linux-gnu"
```

`apt-get download` root nepotřebuje. Kontrola úplnosti:

```bash
ldd ~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell | grep "not found"
```

## Data, která si odporují

| Údaj | Starý web | Dokument / design | Na webu |
|---|---|---|---|
| Počet zaměstnanců | „přibližně 17" | 20 | **20** (novější zdroj) |

Historie firmy v dokumentu uvádí 17 zaměstnanců k roku 2018 a 20 k roku 2026 —
starý web tedy nejspíš jen nebyl aktualizovaný. Přesto stojí za ověření u klienta.

## Fotky — kurátorství

Import je automatický a **nekurátorovaný**. 190 fotek celkem:

```
firma-vyroba     87   klientské, telefon, kvalita kolísá
firma-pruchod    31   klientské, jarní průchod firmou
ostatní sekce    72   ze starého webu, starší a menší
```

Výběr i pořadí řídí `public/img/manifest.json` — stačí z něj položky smazat.
Doporučuju projít před spuštěním.

**Ručně kurátorované sekce.** Kde má blok jiný výběr než „prvních N ze sekce",
dostane vlastní klíč v manifestu — `sluzby-vyroba` pro čtveřici na `/sluzby/`.
Kdyby ten blok četl `firma-vyroba`, pral by se o pořadí s galerií strojového
parku, která čte stejný klíč. Ručně přidané klíče importní skripty nepřepisují
(mergují po klíčích), ale soubor pod nimi ano — proto do nich nedávej fotku,
kterou skript zároveň spravuje.

## Whitespace kolem inline odkazů

Astro při `compressHTML` zahodí zalomení řádku mezi textem a následující značkou,
takže z

```astro
Napište na
<a href="…">info@…</a>
```

vznikne `Napište na<a href=…>` **bez mezery**. Když odkaz začíná na novém řádku,
uzavři mezeru explicitně: `Napište na{' '}`. Odchytí to

```bash
grep -roE "[a-záčďéěíňóřšťúůýž,)]<a " dist/ --include=*.html
```

— po změnách textů to stojí za projetí, v prohlížeči si toho nikdo nevšimne
dřív než klient.

## Kurátorství fotek — kontaktní archy

Vybírat z 87 fotek po jedné je zdlouhavé. Rychlejší je poskládat je do
očíslovaných kontaktních archů (4×3 na arch) a vybírat podle čísel:

```js
// sharp: každou fotku na 420×315 do mřížky, přes levý horní roh SVG s číslem
sharp({create:{width:4*420,height:3*315,channels:3,background:'#fff'}})
  .composite(cells).jpeg({quality:72}).toFile('sheet-1.jpg')
```

Výsledná čísla odpovídají pořadí v `manifest.json`, takže výběr jde rovnou
přepsat na klíč v manifestu. Skript stál za to napsat i pro jednorázové použití —
projít 87 fotek jinak znamená 87 samostatných pohledů.

## Skladba galerií na /reference/ a /o-firme/

Obě stránky mají vlastní klíč v manifestu (`reference-galerie`,
`o-firme-galerie`), který v sobě spojuje víc zdrojů: 21 vybraných z výroby,
za nimi zbytek vhodných a nakonec starší sada z jarního průchodu. Důvod je
stejný jako u `sluzby-vyroba` — kdyby stránky četly sdílené sekce přímo,
prala by se o pořadí a limit s ostatními místy.

`Gallery` umí prop `initial` — ukáže jen prvních N a zbytek schová pod tlačítko
„Zobrazit všech N fotek". Lightbox sbírá i skryté položky **záměrně**: kdo si
otevře fotku, má šipkami projít celou sadu, ne jen viditelný výřez.

## Galerie u služeb

Každá z devíti služeb má vlastní klíč `sl-*` v manifestu. Skladba je stejná jako
u velkých galerií: nejdřív vybrané snímky z `firma-vyroba` a `firma-pruchod`
promíchané tak, aby vedle sebe nestály dva podobné, za nimi starší sada
ze starého webu. Zobrazí se prvních devět, zbytek je pod tlačítkem.

Tím padá nález 1.19 z předávací kontroly — ohýbání plechů, strojní obrábění
a svařování sdílely jednu sekci `vyroba-pro-prumysl` a týž snímek se tak
vydával za tři různé činnosti. Sekce se rozpadla podle toho, co na fotkách
opravdu je: svarové housenky ke svařování, plechové boxy k ohýbání.
Strojní obrábění z ní nedostalo nic, protože tam žádné obrábění nebylo.
