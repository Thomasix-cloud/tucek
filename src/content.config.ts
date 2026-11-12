import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const sluzby = defineCollection({
  loader: glob({ base: './src/content/sluzby', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Krátký název do karty / menu */
      short: z.string(),
      /** Jedna věta do karty služby */
      teaser: z.string(),
      /** SEO meta description (max ~160 znaků) */
      description: z.string().max(170),
      order: z.number(),
      image: image(),
      imageAlt: z.string(),
      highlights: z.array(z.string()).min(1),
    }),
});

export const collections = { sluzby };
