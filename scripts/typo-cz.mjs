/**
 * Česká typografie jako krok po buildu.
 *
 * Proč po buildu a ne ručně ve zdrojích: pravidla se týkají VŠECH textů —
 * stránek, markdownu služeb, dat v `site.ts` i řetězců v komponentách. Ručně
 * rozsypané `&nbsp;` do třiceti souborů nikdo neudrží a při první úpravě textu
 * se to rozejde. Tady se sáhne jen na textové uzly hotového HTML: značky,
 * atributy, `<script>`, `<style>` ani JSON-LD se nemění.
 *
 * Pravidla (ČSN 01 6910):
 *  - nezlomitelná mezera po jednopísmenných předložkách a spojkách k s v z o u a i
 *  - nezlomitelná mezera mezi číslem a jednotkou (200 mm, 300 barů, 9 000 m²)
 *  - nezlomitelná mezera v oddělovači tisíců (2 500) a v telefonních číslech
 *  - nezlomitelná mezera za zkratkami č., cca, max., min. a za řadovou číslovkou
 *  - rozsahy čísel bez mezer kolem pomlčky (2–50 mm)
 *  - em dash — nahrazen pomlčkou – ; v češtině se em dash nepoužívá
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const NBSP = ' ';

/** Jednotky, u kterých nechceme zlom mezi číslem a značkou. */
const UNITS =
  'mm|cm|m|km|m²|m2|m³|m3|kg|t|tun|tuny|barů|bar|MB|kB|GB|ot\\/min|°|%|Kč|hod|min|h|ks|l';

const RULES = [
  // em dash → pomlčka (česká sazba em dash nepoužívá)
  [/—/g, '–'],
  // jednopísmenné předložky a spojky: „v Chyšné" → „v Chyšné"
  // Jen když následující slovo není dlouhé. Jinak vznikne nedělitelný token
  // („a dřevozpracující“), který na úzkém telefonu vyjede z nadpisu ven.
  [
    /(^|[\s(„"'>])([ksvzouaiKSVZOUAI]) (?=[\p{L}\p{N}]{1,11}(?![\p{L}\p{N}]))/gu,
    `$1$2${NBSP}`,
  ],
  // číslo + jednotka
  [new RegExp(`(\\d) (${UNITS})(?![\\p{L}])`, 'gu'), `$1${NBSP}$2`],
  // oddělovač tisíců: 2 500 → 2 500
  [/(\d) (?=\d{3}(?!\d))/g, `$1${NBSP}`],
  // zkratky, po kterých nesmí být zlom
  [/\b(č\.|cca|max\.|min\.|tj\.|např\.|resp\.|ev\.|tzv\.) /g, `$1${NBSP}`],
  // řadová číslovka + slovo: „66. kilometru"
  [/(\d\.) (?=[\p{Ll}])/gu, `$1${NBSP}`],
  // rozsah čísel: „2 – 50 mm" → „2–50 mm"
  [/(\d)\s*–\s*(?=\d)/g, '$1–'],
  // pomlčka nesmí zůstat sama na začátku řádku
  [/ – /g, `${NBSP}– `],
];

/** Úseky, kterých se transformace nesmí dotknout. */
const SKIP = /<(script|style|pre|code)\b[^>]*>[\s\S]*?<\/\1>/gi;

function transformText(text) {
  let out = text;
  for (const [re, to] of RULES) out = out.replace(re, to);
  return out;
}

/** Projde HTML a upraví jen textové uzly mimo značky a mimo vyloučené bloky. */
export function typografie(html) {
  const holes = [];
  html.replace(SKIP, (m, _t, i) => {
    holes.push([i, i + m.length]);
    return m;
  });
  const inHole = (i) => holes.some(([a, b]) => i >= a && i < b);

  let out = '';
  let last = 0;
  const tag = /<[^>]+>/g;
  let m;
  while ((m = tag.exec(html))) {
    const text = html.slice(last, m.index);
    out += inHole(last) ? text : transformText(text);
    out += m[0];
    last = m.index + m[0].length;
  }
  out += inHole(last) ? html.slice(last) : transformText(html.slice(last));
  return out;
}

async function walk(dir, files = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, files);
    else if (e.name.endsWith('.html')) files.push(p);
  }
  return files;
}

/** Astro integrace — zavěsí se na konec buildu. */
export default function typografieCz() {
  return {
    name: 'typografie-cz',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = path.join(dir.pathname, 'client');
        const files = await walk(root).catch(() => walk(dir.pathname));
        let changed = 0;
        let nbsp = 0;
        for (const f of files) {
          const src = await readFile(f, 'utf8');
          const out = typografie(src);
          if (out !== src) {
            await writeFile(f, out);
            changed++;
            nbsp += (out.match(/ /g) || []).length - (src.match(/ /g) || []).length;
          }
        }
        logger.info(`česká typografie: ${changed} souborů, ${nbsp} nezlomitelných mezer`);
      },
    },
  };
}
