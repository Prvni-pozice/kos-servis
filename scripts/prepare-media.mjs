/* Příprava videí a jejich posterů pro web.
 *
 * Zdroje jsou klientská videa z Google Drive ve Full HD a s bitrate ~20 Mbps
 * (42 MB a 88 MB) — takové soubory nelze servírovat návštěvníkům. Skript je
 * překóduje na rozumnou velikost, odstraní zvuk (hero i kontakt běží muted)
 * a vytáhne poster snímek, aby se před načtením videa nezobrazovala díra.
 *
 * Spuštění:  node scripts/prepare-media.mjs <složka-se-zdroji>
 */
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';

const SRC = process.argv[2];
if (!SRC || !existsSync(SRC)) {
  console.error('Použití: node scripts/prepare-media.mjs <složka-se-zdrojovými-videi>');
  process.exit(1);
}

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..');
const VIDEO_OUT = join(ROOT, 'public', 'video');
const IMG_OUT = join(ROOT, 'public', 'img', 'video');
mkdirSync(VIDEO_OUT, { recursive: true });
mkdirSync(IMG_OUT, { recursive: true });

const JOBS = [
  {
    // Hero na úvodní straně. Zdroj je plná verze (42 MB), ne "reduced" —
    // překódováním z originálu vyjde při stejné velikosti lepší obraz.
    src: '1-SNuhcicfKI3UdA_9S9HQOPrF-vwEzuO.bin',
    name: 'hero',
    height: 720,
    crf: 30,
    posterAt: '00:00:01',
  },
  {
    // Video v záhlaví stránky Kontakt.
    src: '1VQjtfA_vYaJuVewH7D0QxQPMSJmDt_St.bin',
    name: 'kontakt',
    height: 720,
    crf: 31,
    posterAt: '00:00:02',
  },
];

const mb = (p) => (statSync(p).size / 1024 / 1024).toFixed(1) + ' MB';

for (const job of JOBS) {
  const src = join(SRC, job.src);
  if (!existsSync(src)) {
    console.warn(`chybí zdroj, přeskakuji: ${job.src}`);
    continue;
  }

  const mp4 = join(VIDEO_OUT, `${job.name}.mp4`);
  execFileSync(ffmpeg, [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-i', src,
    '-an',                                    // zvuk pryč — video běží muted
    '-vf', `scale=-2:${job.height}`,
    '-c:v', 'libx264', '-profile:v', 'main', '-preset', 'slow',
    '-crf', String(job.crf),
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',                // metadata dopředu → rychlejší start
    mp4,
  ]);

  // Poster: první použitelný snímek, ve WebP a ve stejném poměru jako video.
  const rawPoster = join(IMG_OUT, `${job.name}-poster.png`);
  execFileSync(ffmpeg, [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-ss', job.posterAt, '-i', src, '-frames:v', '1',
    '-vf', `scale=-2:${job.height}`,
    rawPoster,
  ]);
  await sharp(rawPoster).webp({ quality: 72 }).toFile(join(IMG_OUT, `${job.name}-poster.webp`));
  execFileSync('rm', ['-f', rawPoster]);

  console.log(`${job.name}: ${mb(src)} → ${mb(mp4)} + poster`);
}
