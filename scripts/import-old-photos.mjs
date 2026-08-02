/* Jednorázový import fotek ze zrcadla starého webu kos-servis.cz.
 *
 * Ze staré galerie bere vždy nejvyšší dostupné rozlišení každé fotky,
 * převádí na WebP (max 1800 px na delší straně) a ukládá do
 * public/img/<sekce>/ pod čitelným jménem.
 *
 * Spuštění:  node scripts/import-old-photos.mjs <cesta-k-mirroru>
 * Mirror:    wget --mirror --page-requisites https://www.kos-servis.cz/
 */
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import sharp from 'sharp';

const MIRROR = process.argv[2];
if (!MIRROR || !existsSync(MIRROR)) {
  console.error('Použití: node scripts/import-old-photos.mjs <cesta-k-www.kos-servis.cz>');
  process.exit(1);
}

const OUT = join(dirname(new URL(import.meta.url).pathname), '..', 'public', 'img');
const MAX_EDGE = 1800;

// Staré URL → sekce v novém webu.
const SECTION = {
  'index': 'uvod',
  'o-nas': 'o-firme',
  'opravy': 'sluzby',
  'opravy-strojnich-zarizeni': 'opravy-strojnich-zarizeni',
  'opravy-hydraulickych-valcu': 'opravy-hydraulickych-valcu',
  'opravy-vyhrazenych-zdvihacich-zarizeni': 'opravy-zdvihacich-zarizeni',
  'opravy-pro-drevozpracujici-prumysl-vcetne-harvestorovych-technologii': 'opravy-lesnicke-techniky',
  'paleni-3d-plazmou': 'paleni-3d-plazmou',
  'specialni-sluzby': 'sluzby',
  'oderu-vzdorne-materialy-technologie-zarovych-nastriku': 'oteruvzdorne-materialy',
  'specialni-svarecske-a-strojni-prace': 'vyroba-pro-prumysl',
  'specialni-svarecske-a-strojni-prace-3': 'vyroba-pro-prumysl',
  'reference': 'reference',
  'kontakt': 'kontakt',
};

// Stock fotky z fotobanky (les, krajina, harvestor) — brief je zakazuje.
// Soubory "sni-mek-obrazovky-*" navzdory jménu stock nejsou: jsou to
// profesionální snímky vlastního stroje Messer OmniMat, takže se importují.
const SKIP = /^(wood-harvesting-machine-|forest-|forest-machine-|landscape-)/i;

const RANK = { fullhd: 4, hd: 3, medium: 2, small: 1, thumbnail: 0 };

const slug = (s) =>
  s.replace(/\.[a-z]+$/i, '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    .slice(0, 60);

// 1) Z každé stránky vytáhni odkazy na média.
const pages = {};
for (const f of readdirSync(MIRROR)) {
  if (!f.endsWith('.html')) continue;
  const html = readFileSync(join(MIRROR, f), 'utf8');
  pages[f.replace(/\.html$/, '')] = [...new Set(html.match(/media\/[a-z]+\/\d+\/[^"'\s>]+/g) ?? [])];
}

// 2) Pro každou fotku (id + jméno) vyber nejvyšší rozlišení napříč celým webem.
const best = new Map();
for (const imgs of Object.values(pages)) {
  for (const rel of imgs) {
    const m = rel.match(/media\/([a-z]+)\/(\d+)\/(.+)/);
    if (!m) continue;
    const [, size, id, name] = m;
    const key = `${id}/${name}`;
    if (!best.has(key) || (RANK[size] ?? 0) > (RANK[best.get(key).size] ?? 0)) {
      best.set(key, { size, rel, id, name });
    }
  }
}

// 3) Převeď na WebP do složky podle sekce. Fotka použitá na více stránkách
//    se importuje do každé sekce, kde se objevila (levné, WebP je malý).
const manifest = {};
let done = 0, skipped = 0;

for (const [page, imgs] of Object.entries(pages)) {
  const section = SECTION[page];
  if (!section) continue;

  for (const rel of imgs) {
    const m = rel.match(/media\/[a-z]+\/(\d+)\/(.+)/);
    if (!m) continue;
    const [, id, name] = m;
    if (SKIP.test(name)) { skipped++; continue; }

    const src = join(MIRROR, best.get(`${id}/${name}`).rel);
    if (!existsSync(src)) continue;

    const file = `${slug(name)}-${id}.webp`;
    const dir = join(OUT, section);
    mkdirSync(dir, { recursive: true });

    // Ve staré galerii je i logo webu a další drobná grafika — do fotogalerie
    // nepatří. Odfiltruje se podle rozměru zdroje.
    try {
      const probe = await sharp(src).metadata();
      if (Math.max(probe.width ?? 0, probe.height ?? 0) < 600) { skipped++; continue; }
    } catch { skipped++; continue; }

    let info;
    try {
      info = await sharp(src)
        .rotate()
        .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(join(dir, file));
    } catch (err) {
      // Ve staré galerii jsou i položky, které nejsou rastrový obrázek
      // (SVG ikony, chybové stránky uložené wgetem). Ty přeskočíme.
      console.warn(`  přeskočeno (${err.message.split('\n')[0]}): ${rel}`);
      skipped++;
      continue;
    }

    (manifest[section] ??= []).push({
      src: `/img/${section}/${file}`,
      width: info.width,
      height: info.height,
      from: rel,
    });
    done++;
  }
}

for (const list of Object.values(manifest)) {
  list.sort((a, b) => a.src.localeCompare(b.src));
}

// Manifest sdílíme s import-client-photos.mjs — přepsat celý soubor by smazalo
// sekce toho druhého skriptu. Doplňujeme proto jen vlastní klíče.
const manifestPath = join(OUT, 'manifest.json');
const merged = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
for (const key of Object.keys(merged)) {
  if (!key.startsWith('firma-')) delete merged[key];
}
writeFileSync(manifestPath, JSON.stringify({ ...merged, ...manifest }, null, 2) + '\n');

console.log(`Importováno ${done} fotek, přeskočeno ${skipped} (stock/screenshoty).`);
for (const [s, l] of Object.entries(manifest).sort()) console.log(`  ${s.padEnd(34)} ${l.length}`);
