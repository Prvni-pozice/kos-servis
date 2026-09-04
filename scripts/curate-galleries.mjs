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
/** F(44) = 44. z profesionálního focení 13. 7. 2026 (sada „firma-profi").
 *  Čísla jsou totožná s názvy souborů od fotografa (Kos-servis-44.jpg). */
const F = pick('firma-profi');
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
    F(44, 'Plazmové pálicí centrum Messer OmniMat L 5600'),
    V(55, 'CNC ohraňovací lis Rico PRCB 35500'),
    F(42, 'Rovnací lis MAQ HD180, kapacita 180 t'),
    F(33, 'Povolovací lavice pro demontáž hydraulických válců'),
    F(21, 'Horizontální vyvrtávačka'),
    F(19, 'Hrotový soustruh'),
    F(36, 'Pásová pila na dělení materiálu'),
    F(30, 'Obrobna'),
    F(38, 'Svařovna'),
  ],

  /* Servisní dodávky na /kontakt/. Klient je připomněl 18. 8. 2026 – fotky
   * z návštěvy ležely v importu nepoužité, protože se braly jako „interiéry
   * dodávky". Venkovní záběry ale přesně dokládají, že jezdíme za zákazníkem.
   * Logo je do fotek dokreslené, vozy zatím polepené nejsou – scripts/brand-vans.py.
   *
   * Poslední snímek je pohled zezadu do vybaveného vozu a logo na něm **není**:
   * obě křídla zadních dveří jsou otevřená, takže žádná plocha, kde by polep
   * ve skutečnosti byl, není v záběru. Dokreslovat ho na hranu dveří by bylo
   * vidět na první pohled. Sada tím zároveň neukazuje třikrát totéž. */
  'servisni-dodavky': [polep(66), polep(64), polep(62), V(69)],

  /* Úvod rozcestníku služeb, blok „Od opravy k výrobě". Klient chtěl fotky
   * s logickou návazností na téma – proto sedřený díl vedle nového, pak
   * výpalky, ohyby a hotový svařenec, tedy přesně ten sled operací. */
  'sluzby-vyroba': [
    V(49, 'Sedřený díl a nový z otěruvzdorného plechu'),
    F(45, 'Výpalky připravené k dalšímu zpracování'),
    F(46, 'Ohnuté díly z ohraňovacího lisu'),
    F(28, 'Renovované rameno nakladače s novými čepy'),
  ],

  /* Reference – klient: „uveřejnil bych už pouze hotové výrobky nebo opravené
   * díly, zde nemusí být strojní vybavení". Žádný náš stroj tu proto není. */
  'reference-galerie': [
    F(28), F(29), F(32), F(16), F(17), F(47), F(46), F(48), F(49),
    N(0), N(2), N(3),
    V(86), V(83), V(78), V(81),
    V(44), V(13), V(10), V(12),
    V(52), V(51), V(49), V(47),
    V(42), V(40), V(37),
  ],

  /* O firmě, „Areál a dílny" – klient chtěl fotky přímo firmy zvenku i zevnitř,
   * ne další výběr z výroby. Vede exteriér, za ním jednotlivé haly.
   * Od 4. 9. 2026 exteriéry z dronu (profesionální focení) – areál je z nich
   * čitelný celý, což ze země nešlo. */
  'o-firme-galerie': [
    F(4), F(3), F(5), F(9), F(10), F(2),
    F(30), F(38), F(44), F(36), F(43), F(19),
  ],

  /* Služby: devět až dvanáct tematických fotek místo dřívějších 12–28.
   * Překryv mezi sekcemi je držený na minimu – proto např. pálicí centrum
   * vidíte buď na strojovém parku, nebo na detailu pálení, ne na obou. */
  'sl-opravy-strojnich-zarizeni': [
    F(39), F(28), F(29), F(42), F(32), N(1), N(3), V(28), V(10),
  ],
  'sl-opravy-hydraulickych-valcu': [
    F(33), F(32), F(34), F(35), F(16), F(17), F(12), F(18), F(13),
  ],
  'sl-opravy-zemedelske-a-stavebni-techniky': [
    N(2), N(5), N(0), N(3), N(4), F(28), F(29), P(25), P(27), P(30), V(29), V(28),
  ],
  'sl-opravy-zdvihacich-zarizeni': [
    V(51), V(52), V(13), V(44), P(30), V(10), V(45), V(46), V(53),
  ],
  'sl-svarovani-a-renovace': [
    F(38), F(40), F(50), V(57), V(58), V(59), P(7), P(9), V(47),
  ],
  'sl-oteruvzdorne-materialy': [
    V(49), V(47), V(50), V(60), V(61), V(86), V(83), V(78), V(81),
  ],
  /* Detail pálení ukazuje práci, ne stroj: sám pálicí portál je na strojovém
   * parku a v prohlídce areálu, sem patří výpalky. Tím se drží pravidlo
   * „stejná fotka ne na třech stránkách po sobě". */
  'sl-paleni-3d-plazmou': [
    F(45), F(47), V(34), V(35), V(39), V(37), V(38), V(42), V(43),
  ],
  'sl-ohybani-a-zpracovani-plechu': [
    F(46), F(48), F(49), V(54), V(56), V(41), V(33), V(36), V(60),
  ],
  'sl-strojni-obrabeni': [
    F(19), F(12), F(13), F(15), F(18), F(21), F(24), F(26), F(31),
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
