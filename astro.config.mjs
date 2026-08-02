import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

/* Mapa starých URL → nové.
 *
 * Starý web servíruje adresy BEZ přípony (`/opravy`); varianta s `.html` na něm
 * vrací 404. Přípona v našich podkladech pochází z `wget --adjust-extension`,
 * které ji při ukládání přidává — na skutečné URL to nevypovídá nic.
 * Obě podoby se přesto generují: `.html` verze nic nestojí a pokryje případné
 * staré odkazy odjinud. */
const staryWeb = {
  '/opravy': '/sluzby/',
  '/specialni-sluzby': '/sluzby/',
  '/opravy-strojnich-zarizeni': '/sluzby/opravy-strojnich-zarizeni/',
  '/opravy-hydraulickych-valcu': '/sluzby/opravy-hydraulickych-valcu/',
  '/opravy-vyhrazenych-zdvihacich-zarizeni': '/sluzby/opravy-zdvihacich-zarizeni/',
  '/opravy-pro-drevozpracujici-prumysl-vcetne-harvestorovych-technologii':
    '/sluzby/opravy-lesnicke-a-zemedelske-techniky/',
  '/paleni-3d-plazmou': '/sluzby/paleni-3d-plazmou/',
  '/oderu-vzdorne-materialy-technologie-zarovych-nastriku':
    '/sluzby/oteruvzdorne-materialy-a-navarovani/',
  '/specialni-svarecske-a-strojni-prace': '/sluzby/svarovani-a-renovace/',
  '/specialni-svarecske-a-strojni-prace-3': '/sluzby/svarovani-a-renovace/',
  '/o-nas': '/o-firme/',
  '/reference': '/reference/',
  '/kontakt': '/kontakt/',
};

const redirects = {};
for (const [from, to] of Object.entries(staryWeb)) {
  redirects[`${from}.html`] = to;
  // /reference a /kontakt existují i jako nové stránky — na ty se nepřesměrovává.
  if (from.replace(/^\//, '') !== to.replace(/^\/|\/$/g, '')) redirects[from] = to;
}

// KOS servis s.r.o. — firemní web (Chyšná, Vysočina).
// Statický build, server běží jen kvůli poptávkovému endpointu s přílohou.
export default defineConfig({
  site: 'https://www.kos-servis.cz',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  // Záměrně 'ignore', ne 'always'. Při 'always' hostitel nejdřív znormalizuje
  // adresu (308 na verzi s lomítkem) a teprve pak hledá redirect pravidlo —
  // staré adresy bez lomítka jako /opravy by tak vždy skončily na 404.
  // Zachování starých URL má přednost před přísnou normalizací; jednotný tvar
  // hlídá kanonický odkaz v BaseLayout a sitemapa.
  trailingSlash: 'ignore',
  redirects,
  // CSS inline do HTML — žádné render-blocking requesty (LCP).
  build: { inlineStylesheets: 'always', format: 'directory' },
});
