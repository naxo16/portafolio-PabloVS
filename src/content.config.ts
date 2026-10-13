import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const casosEstudioCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/casos-estudio' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    year: z.number(),
    status: z.string(),
    role: z.string().optional(),
    tags: z.array(z.string()).optional(),
    url: z.string().optional(),
  })
});

export const collections = {
  'casos-estudio': casosEstudioCollection,
};
