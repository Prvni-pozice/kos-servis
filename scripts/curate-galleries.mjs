/* Přeskládá galerie v public/img/manifest.json.
 *
 * Důvod (připomínky klienta 18. 8. 2026): „u každé služby 16 fotek a některé se
 * opakují a nepůsobí to hezky". Původní sekce vznikly hrubým výběrem z importu –
 * měly 12 až 28 fotek a stejné snímky se objevovaly na třech stránkách po sobě.
 *
 * Tenhle skript je jediný zdroj pravdy o skladbě galerií. Fotky se adresují
 * pořadovým číslem ve zdrojové sadě (`firma-vyroba`, `firma-pruchod`), protože
 * přesně ta čísla jsou na kontaktních arších, podle kterých se vybíralo –
 * viz docs/rozhodnuti.md, „Kurátorství fotek".
 *
 *   node scripts/curate-galleries.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const MANIFEST = 'public/img/manifest.json';
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));

/** V(12) = dvanáctá fotka sady „firma-vyroba", P(3) = třetí z „firma-pruchod". */
const pick = (source) => (n, caption) => {
  const photo = manifest[source]?.[n - 1];
  if (!photo) throw new Error(`${source} nemá fotku č. ${n}`);
  return caption ? { ...photo, caption } : { ...photo };
};
const V = pick('firma-vyroba');
const P = pick('firma-pruchod');
/** Stroje zákazníků, které klient poslal 18. 8. 2026 – viz import-review-photos.mjs. */
const N = (i) => ({ ...manifest['stroje-zakazniku'][i] });

/** Táž fotka dodávky, ale s dokresleným logem (scripts/brand-vans.py).
 *  Rozměry sedí s originálem, mění se jen adresář. */
const polep = (n) => {
  const p = V(n);
  const src = p.src.replace('/img/firma/vyroba/', '/img/servisni-dodavky/');
  if (!existsSync(`public${src}`)) {
    throw new Error(`Chybí ${src} – spusť nejdřív: python3 scripts/brand-vans.py`);
  }
  return { ...p, src };
};

const galerie = {
  /* Strojový park – „fotku každého zmíněného stroje" (přání klienta). Popisky
   * jsou tu proto, že bez nich galerie požadavek nesplní: devět šedých strojů
   * vedle sebe nikomu neřekne, který je který. */
  'strojovy-park-galerie': [
    P(16, 'Plazmové pálicí centrum Messer OmniMat L 5600'),
    P(20, 'Pálicí portál s 3D úkosovou a vrtací hlavou'),
    V(55, 'CNC ohraňovací lis Rico PRCB 35500'),
    V(31, 'Rovnání dílu na hydraulickém lisu'),
    V(15, 'Horizontální vyvrtávačka'),
    V(6, 'Hrotový soustruh'),
    V(22, 'Pásová pila na dělení materiálu'),
    P(4, 'Obrobna'),
    P(8, 'Svařovna'),
  ],

  /* Servisní dodávky na /kontakt/. Klient je připomněl 18. 8. 2026 – fotky
   * z návštěvy ležely v importu nepoužité, protože se braly jako „interiéry
   * dodávky". Venkovní záběry ale přesně dokládají, že jezdíme za zákazníkem.
   * Logo je do fotek dokreslené, vozy zatím polepené nejsou – scripts/brand-vans.py. */
  'servisni-dodavky': [polep(66), polep(64), polep(65), polep(62)],

  /* Úvod rozcestníku služeb, blok „Od opravy k výrobě". Klient chtěl fotky
   * s logickou návazností na téma – proto sedřený díl vedle nového, pak
   * výpalky, ohyby a hotový svařenec, tedy přesně ten sled operací. */
  'sluzby-vyroba': [
    V(49, 'Sedřený díl a nový z otěruvzdorného plechu'),
    V(42, 'Výpalky připravené k dalšímu zpracování'),
    V(41, 'Ohnuté díly z ohraňovacího lisu'),
    V(52, 'Hotový svařenec ramene'),
  ],

  /* Reference – klient: „uveřejnil bych už pouze hotové výrobky nebo opravené
   * díly, zde nemusí být strojní vybavení". Žádný náš stroj tu proto není. */
  'reference-galerie': [
    N(0), N(2), N(3),
    V(86), V(83), V(78), V(81),
    V(44), V(13), V(10), V(12),
    V(1), V(4), V(73), V(19), V(21),
    V(52), V(51), V(49), V(47),
    V(42), V(40), V(37),
    P(22), P(23), P(25), P(30),
  ],

  /* O firmě, „Areál a dílny" – klient chtěl fotky přímo firmy zvenku i zevnitř,
   * ne další výběr z výroby. Vede exteriér, za ním jednotlivé haly. */
  'o-firme-galerie': [
    P(14), P(13), P(11), P(15), P(12),
    V(45), V(46), P(17), P(4), P(6), P(19), P(8),
  ],

  /* Služby: devět až dvanáct tematických fotek místo dřívějších 12–28.
   * Překryv mezi sekcemi je držený na minimu – proto např. pálicí centrum
   * vidíte buď na strojovém parku, nebo na detailu pálení, ne na obou. */
  'sl-opravy-strojnich-zarizeni': [
    V(28), V(29), N(1), N(3), V(31), V(19), V(10), V(12), V(4),
  ],
  'sl-opravy-hydraulickych-valcu': [
    P(2), V(18), V(19), V(21), V(73), V(1), V(12), V(2), V(6),
  ],
  'sl-opravy-zemedelske-a-stavebni-techniky': [
    N(2), N(5), N(0), N(3), N(4), V(29), P(25), P(27), P(30), P(22), P(23), V(28),
  ],
  'sl-opravy-zdvihacich-zarizeni': [
    V(51), V(52), V(13), V(44), P(30), V(10), V(45), V(46), V(53),
  ],
  'sl-svarovani-a-renovace': [
    V(57), V(58), V(59), P(7), P(8), P(9), V(26), V(27), V(47),
  ],
  'sl-oteruvzdorne-materialy': [
    V(49), V(47), V(50), V(60), V(61), V(86), V(83), V(78), V(81),
  ],
  'sl-paleni-3d-plazmou': [
    P(19), P(21), V(34), V(35), V(39), V(37), V(38), V(42), V(43),
  ],
  'sl-ohybani-a-zpracovani-plechu': [
    V(54), V(56), V(41), V(33), V(36), V(32), V(44), V(38), V(60),
  ],
  'sl-strojni-obrabeni': [
    V(3), V(5), V(7), V(8), V(9), V(14), V(16), V(12), V(4),
  ],
};

/* Osiřelé klíče po přejmenované službě by v manifestu zůstaly navždy –
 * sekce `sl-*` proto skládáme od nuly, ne přepisem po jedné. */
for (const key of Object.keys(manifest)) {
  if (key.startsWith('sl-') && !(key in galerie)) delete manifest[key];
}
for (const [key, list] of Object.entries(galerie)) manifest[key] = list;
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

/* Kontrola překryvu – to je ta věc, kterou klient viděl a vadila mu. */
const sluzby = Object.keys(galerie).filter((k) => k.startsWith('sl-'));
const kde = {};
for (const k of sluzby) for (const p of galerie[k]) (kde[p.src] ??= []).push(k);
const vic = Object.values(kde).filter((v) => v.length > 1).length;

for (const [key, list] of Object.entries(galerie)) {
  console.log(`  ${key.padEnd(32)} ${String(list.length).padStart(2)}`);
}
console.log(`\nFotek ve víc než jedné galerii služby: ${vic} (dřív 15).`);
