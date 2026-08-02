import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/* Detailní stránky služeb. Schéma je navržené tak, aby se dalo škálovat
 * na desítky SEO podstránek – obsah řídí Markdown, ne šablona. */
const sluzby = defineCollection({
  loader: glob({ base: './src/content/sluzby', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    /** Pořadí v rozcestníku a číslo v kartě (/ 01, / 02, …). */
    order: z.number(),
    /** Nadpis eyebrow nad H1. */
    eyebrow: z.string(),
    /** Krátký popis do karty v rozcestníku. */
    excerpt: z.string(),
    /** Perex pod H1. */
    intro: z.string(),
    /**
     * Meta description. Perex je na to obvykle moc dlouhý – dobrý úvodní
     * odstavec má jinou práci než popisek ve výsledcích hledání. Když chybí,
     * použije se `intro` (a v Googlu se nejspíš usekne).
     */
    metaDescription: z.string().optional(),
    seoTitle: z.string().optional(),
    tags: z.array(z.string()).default([]),
    /** Odrážky „co konkrétně děláme“ – hlavní obsah z klientského dokumentu. */
    scope: z.array(z.string()).default([]),
    /** Tabulka vybavení: co to je + k čemu slouží. */
    equipment: z.array(z.object({ name: z.string(), role: z.string() })).default([]),
    /** Technické parametry ve skupinách (mono tabulky). */
    specs: z
      .array(
        z.object({
          title: z.string(),
          rows: z.array(z.object({ label: z.string(), value: z.string() })),
        }),
      )
      .default([]),
    /** Klíč sekce v public/img/manifest.json, ze které se plní galerie. */
    gallery: z.string().optional(),
    /** Slugy souvisejících služeb do bloku na konci stránky. */
    related: z.array(z.string()).default([]),
    /** Předvyplněný předmět poptávky z této stránky. */
    inquirySubject: z.string().optional(),
  }),
});

export const collections = { sluzby };
