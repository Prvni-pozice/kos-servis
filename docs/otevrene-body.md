# Otevřené body

Stav k 2. 8. 2026. Web je funkční a kompletní ve struktuře — tohle jsou věci,
které čekají na podklad od klienta nebo na rozhodnutí.

## Blokující spuštění

| Co | Kdo | Poznámka |
|---|---|---|
| **Ostré logo z design systému** | PP | `public/img/brand/logo-kos.png` je zatím výřez z „návrhy loga.png“ na Drivu — nižší rozlišení a **starší kresba**. Ostré logo je v design projektu (`assets/logo-kos.png`, 1187×443), ale přes DesignSync ho stáhnout nelze: `get_file` ořezává na 256 KiB a soubor je větší (ověřeno, `truncated: true`, dekódovalo se 33 % řádků). Nutno stáhnout ručně z webového rozhraní, nebo hodit do Drive složky `1_fRNGCbs5VKTJoZRQJ75QwJB_zMJppCt`. Ideálně SVG. |
| **SMTP přístupy** | PP | Bez nich `/api/poptavka/` vrací 500. Viz `.env.example`, na Vercelu jako env proměnné. |
| **Kontakt na Ing. Viktora Knoppa** | klient | Obchod je jediná osoba bez telefonu a e-mailu — na webu je vidět s poznámkou „Telefon a e-mail doplní klient“. |

## Čeká na klienta

- **Certifikáty a oprávnění** — stránka `/certifikaty/` má strukturu, chybí skeny.
  Vložit do `public/dokumenty/` a přidat odkazy.
- **Text VOP** — `/obchodni-podminky/` je zatím prázdná skořápka (`noindex`).
- **GDPR** — `/ochrana-osobnich-udaju/` obsahuje návrh popisující, co web
  skutečně dělá; potřebuje právní kontrolu a schválení.
- **Souhlas referenčních firem s uvedením loga** — zatím jen seznam názvů.
- **Ověření počtu zaměstnanců** — viz `docs/rozhodnuti.md`.

## Rozhodnutí k dořešení

- **Varianta loga.** Na Drivu je aktuální logo + **4 návrhy modernizace**.
  Design systém počítá s `logo-kos-simple.png` jako budoucím nástupcem.
  Není jasné, která varianta je schválená.
- **Dvě otázky z dokumentu „Úpravy struktury v2“** bez odpovědi klienta.
  Ovlivní rozcestník Služeb a SEO priority:
  1. Dělá firma „řešení pro obory“ a montáže jako reálné zakázky, aby dávalo
     smysl dělat na ně vlastní stránky?
  2. Jak hodně dělá architektonickou kovovýrobu (schodiště, zábradlí), nebo jsou
     „ocelové konstrukce“ celý rozsah?

  Podle odpovědí lze doplnit další SEO podstránky pod `/sluzby/` — kolekce je na to
  navržená, do menu se nic přidávat nemusí.

## Kurátorství fotek

Import je automatický a nekurátorovaný, 190 fotek. Doporučení: projít galerie
a vyřadit slabší snímky. Detaily v `docs/rozhodnuti.md`.

## Média — poznámky

- **Hero video** překódované z `header-kos-servis.mp4` (Full HD 20 Mbps,
  41 MB → 2,9 MB, 720p, bez zvuku). Letecký záběr areálu.
- **Video na kontaktu** z `kontakt-video.mp4` (84 MB → 3,9 MB). Záběr z dílny.
- Ve složce „jarní průchod firmou“ je na Drivu ještě **~40 videí (~1 GB, včetně
  2GB MOV)**, nijak nezpracovaných. Pokud z nich má něco na web, potřebuje střih.
- `public/img` má 41 MB. Při problémech s velikostí repozitáře snížit `MAX_EDGE`
  v importních skriptech z 1800 na 1400 px.

## Nasazení

Běží na **https://kos-servis.vercel.app** — auto-deploy z větve `main`,
naběhne za 60–90 s. Repo: `github.com/Prvni-pozice/kos-servis`.

Zbývá:

**Předávací kontrola proběhla 2. 8. 2026** — výsledky a otázky pro klienta
jsou v `review/REVIEW_REPORT.md`, jednotlivé nálezy v `review/FINDINGS.md`.
Opraveno 29 nálezů, 16 jich čeká na klienta.

- [ ] Doplnit ostré logo
- [ ] Nastavit SMTP env proměnné na Vercelu (bez nich formulář vrací 500)
- [ ] Otestovat odeslání poptávky včetně přílohy
- [x] ~~Zkontrolovat redirecty ze starých URL~~ — ověřeno živě, 301 fungují
- [ ] Zvážit kurátorství fotek
- [ ] Připojit vlastní doménu a přesměrovat starý web

## Výkon (Lighthouse, 2. 8. 2026)

```
                    perf   a11y  best  seo   | LCP     SI
Vercel   desktop    100    100   100   100   | 0,7 s   0,5 s
Vercel   mobil      87–88  100   100   100   | 3,7 s   2,2 s
server   desktop    100    100    78   100   | 0,7 s   0,6 s
server   mobil      80–86  100    78   100   | 3,6 s   2,7 s
```

Měřeno lokálním Lighthouse (veřejné PSI API mělo vyčerpanou kvótu), produkční
build na obou stranách, mobil ze tří běhů. „server" = `npx serve` na portu 4332.

- **Best practices 78 na serveru** je jen chybějící HTTPS na testovacím portu,
  ne rozdíl v kódu.
- **Mobilní LCP ~3,7 s je vlastní váha stránky, ne hosting** — čísla jsou na obou
  stranách skoro stejná. Brzdí to prvních 1,25 MB přenosu: hero video 704 kB,
  které se stahuje hned, a 258 kB fontů v 16 requestech.

Nezkoušené zlepšení, pokud bude potřeba mobilní skóre zvednout:

1. Odložit načtení hero videa až za LCP (`requestIdleCallback`), případně ho
   na pomalém spojení (`navigator.connection.saveData`) nepouštět vůbec —
   poster je WebP a vypadá dobře i sám o sobě.
2. Zúžit fonty na potřebné řezy a subset `latin-ext`; teď se tahá 9 CSS souborů
   `@fontsource`, které dohromady dělají 16 požadavků.

## Hotovo (ať se nedělá dvakrát)

- 19 stránek: Úvod, Služby + 9 detailů, Strojový park, Reference, O firmě,
  Kariéra, Kontakt, Certifikáty, VOP, GDPR, 404
- 26 přesměrování ze starých URL (s `.html` i bez)
- Poptávkový endpoint včetně validací — otestované všechny stavy
- 190 fotek importovaných a převedených na WebP, 2 videa překódovaná
- Sitemap, kanonické URL, JSON-LD (LocalBusiness + BreadcrumbList), `noindex`
  na právních stránkách
- Push 5 komponent zpět do design systému
- `astro check`: 0 chyb, 0 varování

## Všeobecné obchodní podmínky — návrh čeká na schválení

Stránka `/obchodni-podminky/` už není zástupka, ale **návrh** sepsaný na míru
oborům (opravy, zakázková výroba, pálení). Není to právní služba — než se web
spustí, musí znění projít klientem a jeho právníkem. V šabloně jsou dvě věci
k dořešení:

- návrhová poznámka nahoře (blok končící komentářem `konec návrhové poznámky`) —
  po schválení smazat,
- konstanta `ucinnostOd` — doplnit skutečné datum.

Body, které klient musí potvrdit, protože jsou v návrhu odhadnuté: záruční doby
(24 měsíců výroba / 12 měsíců oprava), splatnost 14 dní, lhůta 30 dní pro
převzetí a skladné, vyjádření k reklamaci do 15 dní, omezení náhrady škody
na cenu zakázky.

## Rok založení s.r.o. — 2006 vs 2007

Klient v podkladu k časové ose uvádí založení firmy v roce 2007, obchodní
rejstřík má zápis 29. 11. 2006 (ověřeno v ARES). Na ose je teď obojí:

```
2006   Zápis KOS servis s.r.o. do obchodního rejstříku.
2007   Zahájení činnosti pod novou společností, 10 zaměstnanců.
```

Rozdělení dává smysl, ale formulace roku 2007 je **naše domněnka** — klient
musí potvrdit, že tím rokem myslel rozjezd provozu, ne zápis.

## Připomínky z 5. kola — co zůstalo otevřené

**Tloušťka pálení.** Na `/strojovy-park/` je plazma zestručněná podle přání klienta
a sporná „maximální tloušťka materiálu 200 mm" odtud vypadla. Na
`/sluzby/paleni-3d-plazmou/` ale pořád je — a to i v perexu a meta description.
Odporuje si s autogenem 3–300 mm. Klient musí říct, co platí.

**Skeny certifikátů.** Tři PDF jsou v `docs/`, na web zatím **nejsou nasazené**.
Oprávnění TIČR na tlaková zařízení obsahuje datum narození a adresu bydliště
odpovědného zástupce (Libor Kos) — než to půjde ven, musí se to začernit, nebo
zveřejnit jen čísla oprávnění bez skenů. Texty na `/certifikaty/` už podle
dokumentů opravené jsou.

**Chybějící fotky strojů.** Klient odkazuje na snímky „ohrlis", „rovnacilis",
„Lavice" a „Horizontka" a na video ohraňovacího lisu. Nic z toho zatím nedorazilo.

**Miloš Petrů** (svářecí technolog) není v klientově výčtu kontaktů. Necháváme ho
tam — klient psal „mj." — ale stojí za potvrzení.

**Vypuštěné reference.** BAGO s.r.o. a Technické služby města Pelhřimova nebyly
v klientem schváleném seznamu, tak jsme je vyřadili. Pokud to bylo opomenutí,
vrátíme je.

**Pořadí kontaktů** zůstává podle problému (příjem oprav první), ne podle
klientova výčtu, kde je první obchod. Rozhodnutí z předávací kontroly.

**Logo** už není blokující — majitel si stávající logo přeje ponechat.

## Fotky na /o-firme/ — čeká lepší sada

Galerie na `/o-firme/` pořád čte celou sekci `firma-pruchod` (31 fotek z jarního
průchodu firmou). Klient chystá další složku s lepšími snímky — až dorazí,
nahradit. Do té doby se nevyplatí sekci kurátorovat.

Poznámka ke zdrojům: Drive složka `1pa1wWQIsqCLaq1FY4xy5ZyZYETZLPzYY`
(„Fotky z výroby", 87 HEIC) **už natažená je** — je to sekce `firma-vyroba`
a jede z ní strojový park i čtveřice na `/sluzby/`. Na `/reference/`
a `/o-firme/` je ta druhá, slabší sada (`firma-pruchod`).
