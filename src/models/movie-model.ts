import { z } from 'zod';

const movieSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string().trim().min(2).max(200),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9-]+$/)
      .min(2)
      .max(255),
    shortDescription: z.string().trim().min(20).max(512),
    longDescription: z.string().trim().max(1000).optional(),
    coverImage: z.url(),
    images: z.array(z.url().optional()),
    videos: z.array(z.url().optional()),
    duration: z.coerce.number().int().positive().min(1).max(500),
    releaseDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
    filmCertificate: z.enum(['U', 'UA', 'A', 'PG', 'PG-13', 'R']),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

const createMovieSchema = movieSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const updateMovieSchema = createMovieSchema.partial();

const deleteMovieBySlugSchema = movieSchema.pick({ slug: true });

export {
  movieSchema,
  createMovieSchema,
  updateMovieSchema,
  deleteMovieBySlugSchema,
};
