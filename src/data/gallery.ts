/* Galerie se čtou z public/img/manifest.json, který vygeneruje
 * scripts/import-old-photos.mjs. Díky rozměrům v manifestu má každý
 * <img> width/height, takže se stránka při načítání fotek nehýbe (CLS). */
import manifest from '../../public/img/manifest.json';

export type Photo = { src: string; width: number; height: number; from?: string };

const sections = manifest as Record<string, Photo[]>;

/** Fotky dané sekce; `limit` ořízne počet (např. teaser na úvodce). */
export function photos(section: string, limit?: number): Photo[] {
  const list = sections[section] ?? [];
  return limit ? list.slice(0, limit) : list;
}

export function hasPhotos(section: string): boolean {
  return (sections[section]?.length ?? 0) > 0;
}
