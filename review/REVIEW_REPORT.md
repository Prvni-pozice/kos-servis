# Předávací kontrola webu KOS servis — souhrn

2. srpna 2026 · Podrobné nálezy v `FINDINGS.md`, soupis stránek v `PAGES.md`.

## Co se kontrolovalo

Všech 22 stránek webu, pětkrát a pokaždé jinýma očima: automatické tvrdé kontroly
(odkazy, konzole, přístupnost, výkon, strukturovaná data, responzivita od 375 do
1920 px), integrita obsahu proti veřejnému rejstříku, průchod webem očima
zákazníka na mobilu, UX audit, copywriterská a typografická korektura a srovnání
se třemi konkurenty v oboru.

## Nejdůležitější věci, které se našly a opravily

**Strukturovaná data nefungovala vůbec.** Zápis pro Google byl na všech stránkách
vysázený jako escapovaný text místo skriptu — vyhledávače z něj nepřečetly nic.
Chyba byla v jednom nesprávném zápisu v šabloně. Teď je LocalBusiness
i BreadcrumbList na všech 22 stránkách a JSON je platný.

**Na webu byly vidět interní poznámky.** Na obchodních podmínkách a na ochraně
osobních údajů byl barevný box s textem pro nás včetně cesty ke zdrojovému
souboru. Na kontaktech svítilo u obchodníka „Telefon a e-mail doplní klient",
na certifikátech „doplníme, jakmile je od klienta dostaneme", na referencích
poznámka o chybějících souhlasech. Všechno pryč.

**Chyběl povinný právní údaj.** § 435 občanského zákoníku vyžaduje na webu i zápis
v obchodním rejstříku. Doplněno do patičky a na kontakt — Krajský soud v Českých
Budějovicích, oddíl C, vložka 14718 (ověřeno v ARES).

**Sídlo bylo uvedené špatně.** Web psal „Chyšná 52, 395 01 Pacov". Zapsané sídlo je
**395 01 Chyšná** — Pacov je jen dodací pošta. Opraveno všude včetně dat pro Google.
Ve stejném duchu: časová osa uváděla založení s.r.o. v roce 2007, rejstřík má
29. 11. 2006.

**Formulář hlásil úspěch, i když se poptávka neodeslala.** Kontroloval jen stavový
kód odpovědi. Když serverová část neběží, vrátí se statická stránka se stavem 200
a zákazník dostal „Děkujeme, poptávku máme" — a čekal na telefonát, který by nikdy
nepřišel. Teď se kontroluje i obsah odpovědi.

**Přílohu nešlo přiložit z klávesnice** a **životopis ve Wordu formulář odmítal**,
přestože kariérní stránka o životopis výslovně žádá. Obojí opraveno.

**Hero mělo pevnou šířku 933 px.** Kombinace `aspect-ratio` a `min-height` na jednom
prvku přenese minimum i do druhé osy. Mezi zhruba 700 a 1000 px se stránka
posouvala do boku — na běžném monitoru to nebylo vidět, protože 933 px zhruba
odpovídá šířce obsahu. Opraveno, ověřeno na třinácti šířkách.

**Výkon z 86 na 99–100 na mobilu** (desktop 100/100/100/100). Tři příčiny: hero
video se stahovalo před hlavním obrázkem, fonty stály 16 požadavků a 260 kB, logo
v hlavičce bylo 181kB PNG zobrazované ve 130 × 40 px. Navíc vložená mapa na
kontaktu tahala 293 kB cizího JavaScriptu — teď se načte až po kliknutí, takže
web nedělá jediný požadavek na cizí server, dokud o něj návštěvník nepožádá.

**Přístupnost je čistá na všech 22 stránkách** (axe-core, WCAG 2.1 AA). Opraven
kontrast popisků, hierarchie nadpisů na dvaceti stránkách, oznamování hlášek
formuláře a ovládání klávesnicí.

**Česká typografie.** Ve zdrojích nebyla ani jedna nezlomitelná mezera. Doplněno
1 019 mezer — po jednopísmenných předložkách, mezi číslem a jednotkou, v tisících
a v telefonních číslech — plus 190 anglických em dash nahrazeno českou pomlčkou.
Řeší to jeden krok po buildu, takže to platí i pro texty, které teprve přibudou.

## Co potřebuje vaše nebo klientovo rozhodnutí

Tohle jsou otázky připravené k odeslání klientovi:

1. **Jakou reakční dobu můžeme slíbit?** Konkurenční Tvarpal má na webu „cenovou
   nabídku do 24 hodin". My nikde žádnou lhůtu nemáme a je to jediná věc, kde nás
   měřitelně předbíhá. Formulář navíc už dnes po odeslání tvrdí „ozveme se obvykle
   do jednoho pracovního dne" — je to pravda?
2. **Jaká je provozní doba dílny a příjmu oprav?** Na webu není nikde a Google ji
   u firmy tohoto typu očekává. Dá se volat i mimo ni?
3. **Jaká je maximální tloušťka materiálu?** Stránka pálení uvádí čtyři různá čísla:
   perex 200 mm, plazma 2–50 mm, dělicí řez 120 mm, autogen 3–300 mm. Zákazník
   s 60mm plechem nemá jak zjistit, jestli to vezmeme.
4. **Které značky a jakosti plechů reálně pálíme?** (Hardox, Creusabro, Dilidur,
   Xar, jakosti 11 a 17.) Konkurence je vypisuje, my máme jen obecné „HARDOX" —
   přitom jsou to vyhledávané dotazy.
5. **Certifikáty ke stažení.** Stránka je připravená, ale prázdná, a odkaz na ni
   slibuje „dokumenty ke stažení". Konkurence má ISO v PDF. Můžeme dostat skeny?
6. **Kariéra:** mzdové rozpětí, směnnost, místo výkonu, termín nástupu a jméno
   člověka, který nábor řeší. Bez toho strojař nereaguje.
7. **Reference:** jedna věta ke každé firmě, co jsme pro ni dělali. Dnes je to
   jen seznam názvů. Souhlasy s uvedením log stále chybí.
8. **Montáže v Rusku** — zmínka je převzatá ze starého webu. Má na novém zůstat?
9. **Text obchodních podmínek.** Stránka je prázdná skořápka (je vyřazená
   z vyhledávání, ale odkaz na ni je v patičce na každé stránce).
10. **Revize a zkoušky tlakových zařízení** máte zapsané v rejstříku od roku 2022,
    ale web je nezmiňuje. Děláte je? Kolekce služeb je připravená na desátou stránku.
11. **Fotky.** Galerie „Ukázky provedených prací" na referencích ukazuje stejných
    31 snímků jako „Jak to u nás vypadá" na stránce o firmě, a tři stránky služeb
    sdílejí jednu sadu 11 fotek popsanou pokaždé jako jiná činnost. Potřebuje to
    projít a roztřídit.

## Co jsem záměrně neudělal

Copywriterská persona navrhla přepsat H1 a úvodní odstavce na pěti stránkách
(úvod, služby, strojový park, kariéra, o firmě) — dnes většinou opakují slogan
z hera nebo mluví o firmě místo o zákazníkovi. Přepsané texty jsou připravené
v `FINDINGS.md` (body 3.9 a 3.11), ale **nenasadil jsem je**: mění sdělení, se
kterým klient web schvaloval. Řekněte, jestli je pustit.

Totéž platí pro řešení telefonu v mobilní hlavičce (po odrolování zmizí) —
je to rozhodnutí o vzhledu hlavičky, ne oprava chyby.

## Zbývá před ostrým spuštěním

- [ ] **SMTP přístupy** — bez nich formulář vrací 500 a odeslání nešlo otestovat
      celou cestou. Je to jediná kontrola z protokolu, kterou jsem nemohl dokončit.
- [ ] **Ostré logo** — v hlavičce je pořád prozatímní výřez starší kresby
- [ ] Odpovědi na jedenáct otázek výše
- [ ] Připojení vlastní domény a přesměrování starého webu

## Čísla

```
                       mobil            desktop
Úvodní stránka         99 / 100 / 100 / 100    100 / 100 / 100 / 100
Kontakt                99 / 100 / 100 / 100
Strojový park         100 / 100 / 100 / 100
                       (výkon / přístupnost / best practices / SEO)

Přístupnost (axe-core, WCAG 2.1 AA)   0 porušení na 22 stránkách
Chyby v konzoli                       0
Rozbité odkazy a assety               0
Vodorovné přetečení (375–1920 px)     0
Strukturovaná data                    22/22 stránek, platný JSON
Opraveno v této revizi                29 nálezů, z toho 9 blokujících předání
```


> **Upřesnění (4. 8. 2026):** § 435 NOZ vyžaduje na webu jméno a sídlo podnikatele. Údaj o zápisu v rejstříku včetně oddílu a vložky (spisová značka) zákon váže na **obchodní listiny** — faktury, smlouvy, objednávky — nikoli výslovně na web. Doporučení „doplnit spisovou značku do patičky" bylo v původním znění reportu přeceněné; do patičky patří jméno, sídlo a IČO.
