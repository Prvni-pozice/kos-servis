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
} as const;

/** Roky praxe se počítají, ať se číslo na webu nezasekne v čase. */
export const yearsInBusiness = new Date().getFullYear() - company.founded;

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
    role: 'Příjem oprav · mistr',
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
    role: 'Technolog · konstruktér',
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
    role: 'Obchod · prodej a nákup',
    name: 'Ing. Viktor Knopp',
    solves: 'Nabídky, termíny a obchodní podmínky zakázek. Volejte na ústřednu, přepojí vás.',
  },
  {
    role: 'Jednatel',
    name: 'Libor Kos',
    phone: '+420 565 447 823',
    email: 'libor.kos@kos-servis.cz',
    solves: 'Rámcová spolupráce, větší zakázky a montáže.',
  },
  {
    role: 'Jednatel · vedoucí výroby',
    name: 'Vladimír Kos',
    phone: '+420 565 447 823',
    email: 'vladimir.kos@kos-servis.cz',
    solves: 'Kapacity výroby a průběh zakázky v dílně.',
  },
];

export const stats = [
  { value: String(company.founded), label: 'Od roku' },
  { value: '9 000 m²', label: 'Areál' },
  { value: '20', label: 'Zaměstnanců' },
  { value: 'do 100 km', label: 'Servisní dojezd' },
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
    specs: [
      { label: 'Rozsah řezání', value: '2 500 × 6 500 mm' },
      { label: 'Max. tloušťka', value: '200 mm' },
      { label: 'Pracovní výška', value: '720 mm' },
      { label: 'Hlava', value: '3D úkosová' },
      { label: 'Hořáky', value: 'plazma + acetylen' },
      { label: 'Doplněk', value: 'vrtací agregát' },
    ],
    note:
      'Robustní CNC stroj pro nejtěžší podmínky a nepřetržitý provoz. Oboustranné podélné pohony a přesně obráběné vodicí části zajišťují přesnost řezu i při dlouhodobém nasazení.',
  },
  {
    group: 'Ohraňování',
    name: 'CNC lis Rico PRCB 35500',
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
    name: 'Povolovací lavice',
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

/** Parametry plazmového střediska – detailní tabulky ze starého webu. */
export const plasmaSpecs = [
  {
    title: 'Pálicí stůl Messer OmniMat L 5600',
    rows: [
      { label: 'Rozsah řezání (uložení plechu)', value: '2 500 × 6 500 mm' },
      { label: 'Pracovní výška', value: '720 mm' },
      { label: 'Maximální tloušťka materiálu', value: '200 mm' },
    ],
  },
  {
    title: 'Plazmový hořák Hi Focus 440i',
    rows: [
      { label: 'Rozsah řezání (doporučený)', value: '2 – 50 mm' },
      { label: 'Propalování otvorů (max.)', value: '50 mm' },
      { label: 'Dělicí řez', value: '120 mm' },
      { label: 'Úkosy', value: 'do 45°, do tloušťky 45 mm' },
    ],
  },
  {
    title: 'Autogenní hořák ALFA (kolmé řezy)',
    rows: [
      { label: 'Rozsah řezání', value: '3 – 300 mm' },
      { label: 'Propalování otvorů acetylenem', value: 'max. 130 mm' },
    ],
  },
  {
    title: 'CNC vrtací jednotka',
    rows: [
      { label: 'Průměr vrtáků – běžná ocel', value: '5 – 32 mm' },
      { label: 'Průměr vrtáků – nerez', value: '6 – 18 mm' },
      { label: 'Maximální otáčky', value: '4 000 ot/min' },
      { label: 'Pracovní zdvih', value: '490 mm' },
    ],
  },
] as const;

export const industries = [
  'Dřevozpracující průmysl',
  'Zemědělské podniky',
  'Lesnická technika',
  'Stavebnictví',
  'Průmyslové provozy',
  'Těžká technika a hydraulika',
] as const;

/** Referenční firmy ze starého webu. Loga doplníme po souhlasu klientů. */
export const references = [
  { name: 'Dřevozpracující družstvo DDL', city: 'Lukavec' },
  { name: 'BAGO s.r.o.', city: 'Hnátnice' },
  { name: 'MOSER LEGNO s.r.o.', city: 'Pelhřimov' },
  { name: 'Technické služby města Pelhřimova', city: 'Pelhřimov' },
  { name: 'AGRODAM Hořepník, s.r.o.', city: 'Hořepník' },
  { name: 'VOD Jetřichovec, družstvo', city: 'Jetřichovec' },
  { name: 'E.H.P., s.r.o.', city: '' },
] as const;

/** Typy poptávky ve formuláři – hodnota jde i do předmětu e-mailu. */
export const inquiryTypes = [
  'Oprava',
  'Výroba',
  'Pálení plazmou',
  'Kariéra',
  'Obecný dotaz',
] as const;
