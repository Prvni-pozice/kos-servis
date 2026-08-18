/* Import fotek, které klient poslal 18. 8. 2026 do složky `review/` v repu.
 *
 * Z dvanácti dorazivších snímků se používá šest. Zbylých šest jsou detailní
 * záběry opotřebení a svarů pořízené jako dokumentace zakázky – na webu by
 * snížily dojem z galerie, protože nejsou čitelné bez kontextu. Seznam
 * vyřazených je schválně v souboru, ať se nemusí posuzovat znovu.
 *
 *   node scripts/import-review-photos.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const SRC = 'review';
const OUT_DIR = 'public/img/stroje-zakazniku';
const MANIFEST = 'public/img/manifest.json';
const SECTION = 'stroje-zakazniku';
/** Stejný strop jako u ostatních importů – viz scripts/import-client-photos.mjs. */
const MAX_EDGE = 1800;

/* Pořadí je pořadí v galerii: nejdřív fréza z odstupu, pak manipulátory. */
const VYBRANE = [
  { file: '20260813_103529_resized.jpg', name: 'freza-wirtgen-w210.webp' },
  { file: '20260813_100257_resized.jpg', name: 'freza-wirtgen-bok.webp' },
  { file: '20260813_100245_resized.jpg', name: 'manipulatory-merlo.webp' },
  { file: '20260813_103513_resized.jpg', name: 'frezy-dve-zezadu.webp' },
  { file: '20260813_100307_resized.jpg', name: 'freza-wirtgen-detail.webp' },
  { file: '20260813_100250_resized.jpg', name: 'manipulator-zluty.webp' },
];

/* Nepoužité a proč – aby se příště nezvažovaly znovu. */
const VYRAZENE = {
  '20251204_093104_resized.jpg': 'podvozek zespodu, zanesený, nečitelný motiv',
  '20251204_104659_resized.jpg': 'detail opotřebené lišty na asfaltu, bez kontextu',
  '20251204_104702_resized.jpg': 'totéž z druhé strany',
  '20260116_091416_resized.jpg': 'svařený díl v šeru dílny, tmavé a nečitelné',
  '20260813_100322_resized.jpg': 'šedý detail rámu frézy, bez motivu',
  '20260813_100335_resized.jpg': 'šedý detail rámu frézy, bez motivu',
};

mkdirSync(OUT_DIR, { recursive: true });

const items = [];
for (const { file, name } of VYBRANE) {
  const out = join(OUT_DIR, name);
  const info = await sharp(join(SRC, file))
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(out);
  items.push({ src: `/img/stroje-zakazniku/${name}`, width: info.width, height: info.height, from: file });
  console.log(`${file} → ${name}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} kB`);
}

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
manifest[SECTION] = items;
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

console.log(`\nSekce „${SECTION}": ${items.length} fotek. Vyřazeno ${Object.keys(VYRAZENE).length}.`);
