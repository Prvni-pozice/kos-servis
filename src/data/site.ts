/* Firemní údaje na jednom místě – telefony, lidé, čísla, navigace.
 * Kontakty jsou převzaté ze starého webu kos-servis.cz (ověřeno 2. 8. 2026),
 * čísla o firmě z design briefu schváleného klientem. */

export const company = {
  name: 'KOS servis s.r.o.',
  street: 'Chyšná 52',
  // Zapsané sídlo je Chyšná, ne Pacov – Pacov je jen dodací pošta (ověřeno
  // v ARES 2. 8. 2026). Na obchodních listinách se uvádí sídlo tak, jak je zapsané.
  city: '395 01 Chyšná',
  postalCode: '395 01',
  locality: 'Chyšná',
  region: 'Vysočina',
  ico: '26112736',
  dic: 'CZ26112736',
  phone: '+420 565 447 823',
  phoneHref: '+420565447823',
  email: 'info@kos-servis.cz',
  founded: 1997,
  /** § 435 NOZ vyžaduje zápis v OR i na webu. Ověřeno v ARES 2. 8. 2026. */
  registration: 'Krajský soud v Českých Budějovicích, oddíl C, vložka 14718',
  // Chyšná 52 – souřadnice adresního bodu z OpenStreetMap (Nominatim, 4. 8. 2026).
  // Původní hodnota 49.4506/15.0847 ukazovala o 15 km jižně, u Kamenice nad Lipou.
  geo: { lat: 49.5859, lng: 15.1028 },
  /** Provozní doba dílny a příjmu oprav (doplnil klient 18. 8. 2026). */
  hours: { label: 'Pondělí – pátek, 7:00 – 15:00', schema: 'Mo-Fr 07:00-15:00' },
} as const;

/** Roky praxe se počítají, ať se číslo na webu nezasekne v čase. */
export const yearsInBusiness = new Date().getFullYear() - company.founded;

/* Servisní dojezd. Klient 18. 8. 2026: „může být klidně větší do 300 km nebo
 * na základě dohody" – po specifikaci problému se zajíždí i takhle daleko.
 * Drží se na jednom místě, protože je na úvodce, v číslech i na kontaktu. */
export const serviceRadius = {
  short: 'do 300 km',
  long: 'do 300 km, dál po dohodě',
} as const;

/** „Příjem oprav“ – vyhrazené CTA, jediné místo s teplým akcentem. */
export const intake = {
  label: 'Příjem oprav',
  person: 'Rostislav Vymazal',
  phone: '+420 602 125 699',
  phoneHref: '+420602125699',
} as const;

export const nav = [
  { href: '/', label: 'Úvod' },
  { href: '/sluzby/', label: 'Služby' },
  { href: '/strojovy-park/', label: 'Strojový park' },
  { href: '/reference/', label: 'Reference' },
  { href: '/o-firme/', label: 'O firmě' },
  { href: '/kariera/', label: 'Kariéra' },
  { href: '/kontakt/', label: 'Kontakt' },
] as const;

export const footerDocs = [
  { href: '/certifikaty/', label: 'Certifikáty a oprávnění' },
  { href: '/obchodni-podminky/', label: 'Všeobecné obchodní podmínky' },
  { href: '/ochrana-osobnich-udaju/', label: 'Zpracování osobních údajů' },
] as const;

export type Person = {
  role: string;
  name: string;
  phone?: string;
  email?: string;
  /** Co ten člověk reálně řeší – kontakt řadíme podle problému, ne podle titulu. */
  solves: string;
  /** Chybějící údaj, který má doplnit klient. */
  todo?: string;
};

/* Pořadí je záměrné: servis/havárie → výroba → technika → vedení. */
export const people: Person[] = [
  {
    role: 'Příjem oprav · mistr dílny',
    name: 'Rostislav Vymazal',
    phone: '+420 602 125 699',
    email: 'rosta.vymazal@kos-servis.cz',
    solves: 'Stojí vám stroj nebo potřebujete opravu – sem volejte první.',
  },
  {
    role: 'Středisko plazma',
    name: 'Tomáš Kolman',
    phone: '+420 602 126 814',
    email: 'plazma@kos-servis.cz',
    solves: 'Výpalky, 3D úkosy, poptávky pálení plechů podle výkresu.',
  },
  {
    role: 'Konstruktér · technolog',
    name: 'Mgr. Tomáš Cvrček',
    phone: '+420 603 934 014',
    email: 'tomas.cvrcek@kos-servis.cz',
    solves: 'Nemáte výkres? Připraví dokumentaci i podle vzoru nebo fotky.',
  },
  {
    role: 'Svářecí technolog',
    name: 'Miloš Petrů',
    phone: '+420 606 584 357',
    email: 'milos.petru@kos-servis.cz',
    solves: 'Svařování hliníku, litiny, bronzu a nerezu, navařování a renovace.',
  },
  {
    role: 'Obchodní oddělení · prodej a nákup',
    name: 'Ing. Viktor Knopp',
    phone: '+420 605 837 605',
    email: 'viktor.knopp@kos-servis.cz',
    solves: 'Nabídky, termíny a obchodní podmínky zakázek.',
  },
  {
    role: 'Jednatel',
    name: 'Libor Kos',
    // Mobilní čísla jednatelů doplnil klient 18. 8. 2026 – dřív tu byla
    // dvakrát pevná linka na ústřednu, což jednatele fakticky skrývalo.
    phone: '+420 603 112 255',
    email: 'libor.kos@kos-servis.cz',
    solves: 'Rámcová spolupráce, větší zakázky a montáže.',
  },
  {
    role: 'Jednatel · vedoucí výroby',
    name: 'Vladimír Kos',
    phone: '+420 603 531 889',
    email: 'vladimir.kos@kos-servis.cz',
    solves: 'Kapacity výroby a průběh zakázky v dílně.',
  },
];

export const stats = [
  { value: String(company.founded), label: 'Od roku' },
  { value: '9 000 m²', label: 'Areál' },
  { value: '20', label: 'Zaměstnanců' },
  { value: serviceRadius.short, label: 'Servisní dojezd' },
] as const;

export type Machine = {
  group: string;
  name: string;
  specs: { label: string; value: string }[];
  note?: string;
  /** Hlavní stroj se v mřížce vysází na tmavém poli přes dva řádky. */
  feature?: boolean;
};

export const machines: Machine[] = [
  {
    group: 'Plazma · CNC',
    name: 'Messer OmniMat L 5600',
    feature: true,
    /* Klient chtěl parametry výrazně zestručnit – zůstává rozsah pálení
     * a obě hlavy. Detailní tabulky jsou níž na stránce. */
    specs: [
      { label: 'Rozsah řezání', value: '2 500 × 6 500 mm' },
      { label: 'Hlava', value: '3D úkosová' },
      { label: 'Doplněk', value: 'vrtací agregát' },
    ],
    note:
      'Robustní CNC stroj pro nejtěžší podmínky a nepřetržitý provoz. Oboustranné podélné pohony a přesně obráběné vodicí části zajišťují přesnost řezu i při dlouhodobém nasazení.',
  },
  {
    group: 'Ohraňování',
    name: 'CNC ohraňovací lis Rico PRCB 35500',
    specs: [
      { label: 'Délka', value: '3 600 mm' },
      { label: 'Síla', value: '500 t' },
      { label: 'Konstr. plech', value: 'do 20 mm' },
      { label: 'Otěruvzdorný', value: 'do 15 mm' },
    ],
  },
  {
    group: 'Rovnání',
    name: 'Rovnací lis MAQ HD180',
    specs: [
      { label: 'Kapacita', value: '180 t' },
      { label: 'Šířka stolu', value: '1 550 mm' },
      { label: 'Výška', value: '900 mm' },
    ],
  },
  {
    group: 'Hydraulika',
    name: 'Povolovací lavice pro demontáž hydraulických válců',
    specs: [
      { label: 'Délka', value: 'do 4 000 mm' },
      { label: 'Tlak', value: 'do 300 barů' },
    ],
  },
  {
    group: 'Obrábění',
    name: 'Horizontální vyvrtávačka',
    specs: [
      { label: 'Max. dílec', value: '1 250 × 1 400 mm' },
      { label: 'Výška', value: '1 120 mm' },
    ],
  },
  {
    group: 'Soustružení',
    name: 'Hrotový soustruh',
    specs: [
      { label: 'Max. průměr', value: '800 mm' },
      { label: 'Max. délka', value: '5 000 mm' },
    ],
  },
];

/* Parametry plazmového střediska. Původně to byly čtyři tabulky ze starého webu;
 * klient je chtěl výrazně zestručnit na rozsah pálení a obě hlavy.
 * Klient 18. 8. 2026: platí autogen 3 – 200 mm (ne 300), dělicí řez plazmou
 * ze stránky pryč. Tím zmizel i rozpor s „max. tloušťkou materiálu 200 mm". */
export const plasmaSpecs = [
  {
    title: 'Rozsah pálení',
    rows: [
      { label: 'Formát plechu', value: '2 500 × 6 500 mm' },
      { label: 'Plazma – doporučený rozsah', value: '2 – 50 mm' },
      { label: 'Autogen – kolmé řezy', value: '3 – 200 mm' },
    ],
  },
  {
    title: '3D úkosová a vrtací hlava',
    rows: [
      { label: 'Úkosy', value: 'do 45°, do tloušťky 45 mm' },
      { label: 'Vrtání – běžná ocel', value: '5 – 32 mm' },
      { label: 'Vrtání – nerez', value: '6 – 18 mm' },
    ],
  },
] as const;

/* Pořadí odráží dnešní skladbu zakázek, ne historii firmy. Lesnictví je dnes
 * 5–10 % kapacity (klient 18. 8. 2026), proto není první. Těžební průmysl
 * je nový obor – klient ho chtěl doplnit ke stavebnictví. */
export const industries = [
  'Zemědělské podniky',
  'Stavebnictví a těžební průmysl',
  'Dřevozpracující průmysl',
  'Průmyslové provozy',
  'Lesnická technika',
  'Těžká technika a hydraulika',
] as const;

/* Seznam schválený klientem, doplněný o BAGO ze starého webu. Technické služby
 * města Pelhřimova klient 18. 8. 2026 vyřadil a nahradil je firmou SOMPO.
 * Klient chystá další firmy. */
export const references = [
  { name: 'Dřevozpracující družstvo DDL', city: 'Lukavec' },
  { name: 'BAGO s.r.o.', city: 'Hnátnice' },
  { name: 'MOSER LEGNO s.r.o.', city: 'Pelhřimov' },
  { name: 'SOMPO, a.s.', city: 'Pelhřimov' },
  { name: 'AGRODAM Hořepník, s.r.o.', city: '' },
  { name: 'VOD Jetřichovec, družstvo', city: '' },
  { name: 'E.H.P., s.r.o.', city: '' },
  { name: 'KUKS a.s.', city: 'Pelhřimov' },
  { name: 'BES s.r.o.', city: '' },
] as const;

/** Typy poptávky ve formuláři – hodnota jde i do předmětu e-mailu. */
export const inquiryTypes = [
  'Oprava',
  'Výroba',
  'Pálení plazmou',
  'Kariéra',
  'Obecný dotaz',
] as const;
