/* Import klientských fotek z Google Drive.
 *
 * Fotky z průchodu firmou jsou iPhone HEIC (3024×4032, ~2,5 MB každá).
 * sharp je neotevře — iOS je ukládá jako dlaždicovou mřížku a libheif v sharpu
 * na to má bezpečnostní limit — proto jde dekódování přes heic-convert
 * a teprve výsledek zpracuje sharp.
 *
 * Spuštění:  node scripts/import-client-photos.mjs
 * Výstup:    public/img/firma/*.webp + doplnění public/img/manifest.json
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import convert from 'heic-convert';
import sharp from 'sharp';

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..');
const TMP = '/tmp/claude-1000/-data-bot/54b190c9-1a6c-41ed-979a-d4f05582fdab/scratchpad/heic';
const OUT = join(ROOT, 'public', 'img', 'firma');
const MAX_EDGE = 1800;

/* Seznam souborů je v drive-photos.json — autoritativní výpis z Drive API.
 * HTML stránky sdílené složky se pro tohle použít nedá: donačítá se
 * JavaScriptem, takže v odpovědi chybí část položek. */
const FOLDERS = JSON.parse(
  readFileSync(join(dirname(new URL(import.meta.url).pathname), 'drive-photos.json'), 'utf8'),
);

mkdirSync(TMP, { recursive: true });
mkdirSync(OUT, { recursive: true });

const slug = (s) =>
  s.replace(/\.[a-z]+$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const manifestPath = join(ROOT, 'public', 'img', 'manifest.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};

for (const [section, entries] of Object.entries(FOLDERS)) {
  if (section.startsWith('_')) continue;
  const files = entries.map(([id, title]) => ({ id, title }));
  console.log(`${section}: ${files.length} obrázků ke zpracování`);

  const dir = join(OUT, section);
  mkdirSync(dir, { recursive: true });
  const key = `firma-${section}`;
  manifest[key] = [];

  for (const f of files) {
    const outFile = join(dir, `${slug(f.title)}.webp`);
    if (!existsSync(outFile)) {
      const src = join(TMP, `${f.id}.bin`);
      if (!existsSync(src)) {
        execFileSync('curl', ['-sL', '-o', src, `https://drive.google.com/uc?export=download&id=${f.id}`]);
      }
      const buf = readFileSync(src);
      // Stažení může vrátit HTML (soubor není sdílený odkazem) — takové přeskoč.
      if (buf.subarray(0, 15).toString('ascii').includes('<!doctype')) {
        console.warn(`  nedostupné (není sdíleno odkazem): ${f.title}`);
        continue;
      }
      let raw = buf;
      if (/\.heic$/i.test(f.title)) {
        raw = Buffer.from(await convert({ buffer: buf, format: 'JPEG', quality: 0.92 }));
      }
      await sharp(raw)
        .rotate()
        .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outFile);
    }
    const meta = await sharp(outFile).metadata();
    manifest[key].push({
      src: `/img/firma/${section}/${slug(f.title)}.webp`,
      width: meta.width,
      height: meta.height,
      from: `gdrive:${f.id}`,
    });
  }

  manifest[key].sort((a, b) => a.src.localeCompare(b.src));
  console.log(`  hotovo: ${manifest[key].length} fotek → public/img/firma/${section}/`);
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('manifest.json aktualizován');
