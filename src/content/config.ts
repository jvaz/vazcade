import { defineCollection, z } from 'astro:content';

const gamesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    publishDate: z.string().transform((str) => new Date(str)),
    controls: z.string().optional(),
    folder: z.string(), // The folder name in public/games/
  }),
});

export const collections = {
  'games': gamesCollection,
};
