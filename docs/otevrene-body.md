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

Web **není v Gitu a není nikde nasazený**. Před prvním commitem projít security
gate podle `/data/bot/CLAUDE.md`. `.gitignore` už blokuje `.env`, klíče
a build výstupy.

Před nasazením na Vercel:

- [ ] Doplnit ostré logo
- [ ] Nastavit SMTP env proměnné
- [ ] Otestovat odeslání poptávky včetně přílohy
- [ ] Zkontrolovat, že redirecty ze starých URL fungují (26 pravidel)
- [ ] Zvážit kurátorství fotek

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
