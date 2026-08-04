# Nálezy předávací kontroly

Web: KOS servis s.r.o. · Revize: 2. 8. 2026 · Protokol: skill `pre-launch-review`
Kontrolováno proti lokálnímu produkčnímu buildu (větev `main`), 22 stránek.

Stav: **opraveno** = hotovo a znovu ověřeno v této session · **k rozhodnutí** =
čeká na klienta nebo na vaše rozhodnutí · **návrh** = připravený text, nenasazený.

---

## Fáze 0 — automatické kontroly

| # | Prio | Stránka | Nález | Oprava | Stav |
|---|---|---|---|---|---|
| 0.1 | P0 | všech 22 | JSON-LD se vypisoval **jako escapovaný text**, ne jako skript. `<set:html value={...}>` není platný zápis — Astro z toho udělalo prvek `<set>` a celý blok zescapovalo. Vyhledávače nečetly LocalBusiness ani BreadcrumbList. | `<script type="application/ld+json" set:html={...} />` v `BaseLayout.astro` a `Breadcrumbs.astro` | opraveno |
| 0.2 | P1 | všech 22 | Chyběl `og:image` — sdílený odkaz byl bez náhledu | `public/img/og-default.jpg` 1200×630 + `og:image*` a `twitter:card` v `BaseLayout` | opraveno |
| 0.3 | P1 | 18 stránek | Kontrast 2,47:1 u `.card-kicker` a `.person .todo` (`--color-mid` je v systému pro *disabled/placeholder*) | přepnuto na `--color-steel` (5,01:1) | opraveno |
| 0.4 | P1 | tmavé pruhy | `.dark h6` nezabíralo na `<div class="h6">` — steel na navy, pod AA | selektory doplněny o třídy `.h2–.h6` | opraveno |
| 0.5 | P1 | 20 stránek | Přeskakované úrovně nadpisů (H1→H3, H2→H4). Patička sázela `<h4>` po H2 v obsahu | patička na `<h2 class="h4">`, mřížka strojů, certifikáty, kariéra, formulář a skupiny parametrů srovnány; přidány velikostní třídy `.h2–.h5`, aby úroveň řídila strukturu a třída vzhled | opraveno |
| 0.6 | P1 | 9 stránek služeb | Meta description 207–249 znaků (perex sloužil zároveň jako popisek) | do schématu kolekce přidán `metaDescription`, dopsáno 9 popisků 135–152 znaků | opraveno |
| 0.7 | P2 | sitemapa | `/obchodni-podminky/` a `/ochrana-osobnich-udaju/` mají `noindex`, ale byly v sitemapě | filtr v `astro.config.mjs`, sitemapa má 17 URL | opraveno |
| 0.8 | P0 | `/`, `/kontakt/` | **Hero mělo pevnou šířku 933 px.** `aspect-ratio` + `min-height` na jednom prvku přenese minimum přes poměr i na `min-width`. Mezi ~700 a ~1000 px se stránka posouvala do boku | výška se počítá ručně, proměnné `--hero-ratio` a `--hero-min` | opraveno |
| 0.9 | P1 | `/kontakt/` | Vložená mapa OpenStreetMap tahala 293 kB cizího JS při načtení stránky — výkon 91 a požadavek na cizí server bez vyžádání | mapa se načte až po kliknutí, vedle přímý odkaz do map | opraveno |
| 0.10 | P1 | `/sluzby/opravy-lesnicke…/` | Vodorovné přetečení 13 px na 375 px | `min-width: 0` v mřížce, zalomení dlouhých CTA, `overflow-wrap` na nadpisech | opraveno |
| 0.11 | — | všech 22 | Konzole bez chyb, žádné 404, všechny interní odkazy 200, `lang="cs"`, kanonické URL, robots.txt | — | v pořádku |
| 0.12 | P1 | formulář | **Odeslání nelze otestovat od konce ke konci — chybí SMTP.** Bez něj `/api/poptavka/` vrací 500 | čeká na přístupy | otevřeno |

## Fáze 1 — integrita obsahu

| # | Prio | Stránka | Nález | Oprava | Stav |
|---|---|---|---|---|---|
| 1.1 | P0 | `/obchodni-podminky/` | Na veřejné stránce byl **vývojářský box včetně cesty ke zdrojáku** („Znění vložte do tohoto souboru: `src/pages/…`") | box odstraněn | opraveno |
| 1.2 | P0 | `/ochrana-osobnich-udaju/` | Totéž — „Návrh k právní kontrole… Soubor: `src/pages/…`" | box odstraněn | opraveno |
| 1.3 | P0 | `/kontakt/`, `/` | U Ing. Viktora Knoppa svítilo **„Telefon a e-mail doplní klient"** | pole `todo` se vykresluje jen ve vývoji; text karty říká, že spojí ústředna | opraveno |
| 1.4 | P0 | `/certifikaty/` | „Skeny… doplníme, jakmile je **od klienta** dostaneme" — psáno z pohledu agentury | přepsáno na výzvu zákazníkovi | opraveno |
| 1.5 | P0 | `/reference/` | „Loga referenčních firem doplníme po získání souhlasu klientů" | odstraněno | opraveno |
| 1.6 | **P0** | patička, `/kontakt/` | **Chyběl zápis v obchodním rejstříku.** § 435 NOZ ho vyžaduje i na webu | doplněno „Krajský soud v Českých Budějovicích, oddíl C, vložka 14718" (ověřeno v ARES) | opraveno |
| 1.7 | P1 | celý web | Sídlo uváděno jako **Pacov**, zapsané sídlo je **Chyšná** (Pacov je jen dodací pošta) | `city: '395 01 Chyšná'`, JSON-LD rozdělen na `postalCode` / `addressLocality` / `addressRegion` | opraveno |
| 1.8 | P1 | `/o-firme/` | Časová osa uváděla založení s.r.o. **2007**, rejstřík má **29. 11. 2006** | opraveno na 2006 | opraveno |
| 1.9 | P1 | formulář vs zásady | Rozpor v právním titulu: pod formulářem „souhlasíte", v zásadách „oprávněný zájem" | text pod formulářem přepsán bez slova souhlas | opraveno |
| 1.10 | P1 | `/kariera/` + zásady | Formulář sbírá životopisy, ale zásady zpracování uchazečů vůbec nepopisovaly | doplněna sekce o životopisech (6 měsíců) a sekce o mapě | opraveno |
| 1.11 | P0 | `/kariera/` | **Životopis ve Wordu formulář odmítl** — `accept` i serverový whitelist braly jen výkresy | doplněno `doc/docx/odt/rtf`, popisek pole na kariéře přepsán | opraveno |
| 1.12 | P1 | `/kontakt/` | Číslo na ústřednu jako jediné na webu nešlo kliknout; popisek „Telefon / fax" | `tel:` odkaz, fax vypuštěn | opraveno |
| 1.13 | P1 | `/sluzby/oteruvzdorne…/` | Perex končil nesmyslem „kde se materiál rychle **projíždí**" | přepsáno | opraveno |
| 1.14 | P1 | `/o-firme/` | Chybějící čárka měnila význam: „opravy trubek pístnic" | „opravy trubek, pístnic a pístních tyčí" | opraveno |
| 1.15 | P1 | `/sluzby/paleni-3d-plazmou/` | **Rozpor v maximální tloušťce:** perex 200 mm, autogen 3–300 mm, plazma 2–50 mm, dělicí řez 120 mm | potřebuje potvrzení klienta, viz REVIEW_REPORT | k rozhodnutí |
| 1.16 | P1 | celý web | Nikde není **provozní doba**, JSON-LD nemá `openingHours` | čeká na údaj od klienta | k rozhodnutí |
| 1.17 | P1 | `/o-firme/` | Zmínka o montážích **v Rusku** (převzato ze starého webu) | rozhodnutí klienta | k rozhodnutí |
| 1.18 | P1 | `/reference/` | Galerie „Ukázky provedených prací" ukazuje **stejných 31 fotek** jako „Jak to u nás vypadá" na `/o-firme/` | potřebuje kurátorství fotek | k rozhodnutí |
| 1.19 | P1 | 3 stránky služeb | Tatáž galerie (11 fotek) popsaná třikrát jinak — jeden snímek jako tři různé činnosti | potřebuje roztřídění fotek | k rozhodnutí |
| 1.20 | P2 | celý web | V rejstříku je zapsaná činnost „revize a zkoušky tlakových zařízení", web ji nezmiňuje | otázka na klienta | k rozhodnutí |
| 1.21 | P2 | `/` | Číslo „100 km" uváděno třemi způsoby, dlaždice „Strojní park" vs „Strojový park" | sjednoceno na „do 100 km" a „Strojový park" | opraveno |
| 1.22 | P2 | `/reference/` | „E.H.P., s.r.o." nemá město, „AGRODAM Hořepník" má město dvakrát | čeká na údaj | k rozhodnutí |

## Fáze 2 — pohled zákazníka

| # | Prio | Stránka | Nález | Oprava | Stav |
|---|---|---|---|---|---|
| 2.1 | **P0** | formulář | **Formulář hlásil úspěch i když odeslání selhalo.** Kontroloval jen `res.ok`; když SSR route neběží, vrátí se statická 404 se stavem 200 → „Děkujeme, poptávku máme" a poptávka nikam nešla | kontroluje se i `data.ok === true` | opraveno |
| 2.2 | P1 | mobil, všechny | Po odrolování **není v hlavičce telefon** — `.call` se pod 900 px skrývá a v menu číslo není | návrh řešení v REVIEW_REPORT (rozhodnutí o vzhledu hlavičky) | k rozhodnutí |
| 2.3 | P1 | `/sluzby/paleni-3d-plazmou/` | Odpověď na „co vám mám poslat?" je až na šesté obrazovce, schovaná pod nadpisem Galerie | přesun sekce — návrh v reportu | návrh |
| 2.4 | P1 | detaily služeb | Mezi výčtem prací a postupem je na mobilu ~3 600 px fotogalerie | mřížka 2 sloupců / „zobrazit všech 12" | návrh |
| 2.5 | P1 | `/` | Mezi šesti službami na úvodní stránce **chybí pálení plazmou**, přestože je v H1 i v názvu | rozhodnutí, kterou službu vyměnit | k rozhodnutí |
| 2.6 | P1 | `/`, `/kontakt/` | Nikde nestojí, **že přijedou k zákazníkovi** — jen „servisní dojezd 100 km" | text čeká na potvrzení klienta | k rozhodnutí |
| 2.7 | P1 | `/kontakt/` | Mapa byla zazoomovaná na pole — Pacov ani D1 nebyly v záběru | mapa je teď na kliknutí + přímý odkaz do map | částečně |
| 2.8 | P2 | `/kontakt/` | Automatický posun na formulář přeskočí H1 i kontaktní osoby | návrh: kotva místo skriptu | návrh |
| 2.9 | P2 | `/` | Hero video 2,98 MB se na mobilu stáhne vždy, kromě `saveData` a 2G | video se teď načítá až po `load` v nečinné chvíli | částečně |

## Fáze 3 — UX a copy

| # | Prio | Stránka | Nález | Oprava | Stav |
|---|---|---|---|---|---|
| 3.1 | P0 | formulář | **Příloha nešla přiložit klávesnicí** — `display: none` vyřadilo `input[type=file]` z pořadí tabulátoru | třída `.sr-only` (vizuálně skryté, fokusovatelné) + viditelný focus na popisku | opraveno |
| 3.2 | P1 | formulář | Hláška o úspěchu je nad poli, uživatel kliká dole — nebylo ji vidět; čtečka ji neoznámila | `role="status"` / `role="alert"`, `aria-live`, posun a fokus na hlášku | opraveno |
| 3.3 | P1 | formulář | Chybová hláška prosakovala anglicky („Failed to fetch") | anglické systémové zprávy se nahradí českou větou | opraveno |
| 3.4 | P1 | 9 stránek služeb | CTA pruh nesl „**Odeslat poptávku →**", ale je to jen odkaz — nic se neodesílalo | „Vyplnit poptávku →"; původní text zůstal jen na odesílacím tlačítku | opraveno |
| 3.5 | P1 | `/sluzby/` | Názvy služeb byly `<span>` — v osnově stránky ani ve čtečce vůbec nefigurovaly | `ServiceCard` sází nadpis podle nové prop `level` | opraveno |
| 3.6 | P1 | celý web | **Teplý akcent přestal být vyhrazený** pro Příjem oprav: nesl ho odkaz „Detail →" (9× pod sebou), letopočty v časové ose a odrážky v textech | `card-meta` a letopočty na navy, odrážky na steel | opraveno |
| 3.7 | P1 | celý web | **V celém `src/` nebyla jediná nezlomitelná mezera.** Předložky, jednotky, tisíce a telefony se lámaly přes řádek | krok po buildu `scripts/typo-cz.mjs` — 1 019 nezlomitelných mezer na 20 stránkách, plus rozsahy bez mezer a zkratky | opraveno |
| 3.8 | P1 | celý web | Jako pauzová pomlčka byl všude **em dash —**, česká sazba používá – | 190 výskytů nahrazeno ve zdrojích, pravidlo hlídá i build | opraveno |
| 3.9 | P1 | `/`, `/sluzby/`, `/strojovy-park/`, `/kariera/` | H1 opakují hero slogan nebo název položky v menu; perexy mluví o firmě, ne o zákazníkovi | připravené přepisy v REVIEW_REPORT — mění sdělení klienta, nenasazuji bez schválení | návrh |
| 3.10 | P1 | `/kariera/` | Chybí mzda, směnnost, místo výkonu, nástup a jméno člověka, který nábor řeší | čeká na klienta | k rozhodnutí |
| 3.11 | P1 | `/o-firme/`, `/kariera/` | Marketingová vata: „v širokém rozsahu", „výhodná poloha v rámci republiky", „zavedená", „rozmanité zakázky" | přepisy v REVIEW_REPORT | návrh |
| 3.12 | P1 | hlavička 901–1150 px | Tlačítko Poptávka mizí dřív, než se objeví mobilní varianta | rozhodnutí o hlavičce, viz 2.2 | k rozhodnutí |
| 3.13 | P2 | formulář | Není vidět, co je povinné; chybové stavy polí jsou nastylované, ale nepoužité | návrh v reportu | návrh |
| 3.14 | P2 | celý web | Škála `--space-*` se nepoužívá ani jednou, rozestupy jsou natvrdo v inline stylech | úklid mimo rozsah revize | otevřeno |
| 3.15 | P2 | galerie | Alt texty jsou „… – foto 7", u ~190 fotek | potřebuje popisky od klienta | k rozhodnutí |

## Fáze 4 — srovnání s oborem

Porovnáno s KOVOTVAR (Pacov), TVARPAL (Hradec Králové) a OpeTech (Velešín).

**Kde jsme první:** rychlost (naše TTFB 74 ms proti 1,95 s u Kovotvaru), hloubka
SEO (9 stránek služeb proti 4 stránkám celkem u konkurence), technické parametry
po jednotlivých nástrojích, větší pálicí stůl (2 500 × 6 500 mm), sedm jmenovaných
lidí s telefonem, jmenované reference, vlastní fotky z dílny.

| # | Prio | Kde nás trumfnou | Návrh |
|---|---|---|---|
| 4.1 | P1 | TVARPAL slibuje **nabídku do 24 hodin** a zajištění dopravy. My nemáme žádnou lhůtu | potvrdit u klienta a doplnit — největší jednotlivý dopad ze všech nálezů | k rozhodnutí |
| 4.2 | P1 | TVARPAL vypisuje **značky a jakosti plechů** (Hardox, Creusabro, Dilidur, Xar) i max. hmotnost | doplnit, co reálně pálíme — jsou to zároveň vyhledávané dotazy | k rozhodnutí |
| 4.3 | P1 | KOVOTVAR má **certifikáty ke stažení v PDF** | naše stránka certifikátů zatím žádný soubor nemá | k rozhodnutí |
| 4.4 | P1 | TVARPAL má u referencí **jméno realizace**, ne jen firmy | doplnit větu ke každé referenci | k rozhodnutí |
| 4.5 | P2 | OpeTech má **kalkulátor výpalků** z DXF | levná varianta: říct u formuláře „nemáte výkres? nakreslíme podle fotky" | návrh |

**Verdikt:** v této skupině je náš web nejlepší — rychlejší, hlubší v parametrech,
jediný s konkrétními lidmi u telefonů. Konkurence nás nepředbíhá obsahem, ale
dvěma větami: závazkem rychlosti a doložitelnou kvalitou.

---

## Souhrn

```
Fáze 0 (automatická)   22 stránek, 0 chyb konzole, 0 rozbitých odkazů, 0 přetečení
Přístupnost (axe)      0 porušení WCAG 2.1 AA na všech 22 stránkách
Lighthouse mobil       úvod 99 · kontakt 99 · strojový park 100 · a11y/best/SEO 100
Lighthouse desktop     100 / 100 / 100 / 100
Strukturovaná data     LocalBusiness + BreadcrumbList na 22/22 stránkách, platný JSON
Opraveno               29 nálezů, z toho 9 P0
Čeká na klienta        16 nálezů
Připravené návrhy      8 (texty hotové, nenasazené — mění sdělení klienta)
```


> **Upřesnění (4. 8. 2026):** § 435 NOZ vyžaduje na webu jméno a sídlo podnikatele. Údaj o zápisu v rejstříku včetně oddílu a vložky (spisová značka) zákon váže na **obchodní listiny** — faktury, smlouvy, objednávky — nikoli výslovně na web. Doporučení „doplnit spisovou značku do patičky" bylo v původním znění reportu přeceněné; do patičky patří jméno, sídlo a IČO.
