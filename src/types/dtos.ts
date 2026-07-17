// dtos/CreateMovie.ts
import { z, ZodArray } from 'zod';

import {
  createMovieSchema,
  movieSchema,
  updateMovieSchema,
} from '../models/movie-model';

export type Movie = z.infer<typeof movieSchema>;
export type CreateMovie = z.infer<typeof createMovieSchema>;
export type UpdateMovie = z.infer<typeof updateMovieSchema>;

export const getMoviesParamsSchema = z.object({
  language: z.string().optional(),
  genre: z.string().optional(),
  format: z.string().optional(),
  cursor: z.coerce
    .number('Cursor must be positive integer')
    .int()
    .nonnegative('Number must be positive integer')
    .optional(),
  limit: z.coerce
    .number('limit must be a number')
    .int()
    .positive('limit must be positive integer')
    .min(1, 'Minimum limit must be 1')
    .max(100)
    .default(20),
});

export const getParamsSchema = z
  .object({
    filters: z
      .array(
        z.object({
          field: z.string('field for filters is required'),
          operator: z.string('operator for filters is required'),
          value: z.union(
            [
              z.string(),
              z.number(),
              z.array(z.union([z.string(), z.number()])),
            ],
            {
              error: (issue) => {
                if (issue.input === undefined) {
                  return 'Value is required';
                }

                return 'Value must be a string or a number or array';
              },
            }
          ),
        })
      )
      .optional(),
    sort: z
      .array(
        z.object({
          field: z.string(),
          order: z.enum(['ASC', 'DESC']),
        })
      )
      .optional(),
    cursor: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
    //   cursor: z.coerce
    //     .number('Cursor must be positive integer')
    //     .int()
    //     .nonnegative('Number must be positive integer')
    //     .optional(),
    limit: z.coerce
      .number('limit must be a number')
      .int()
      .positive('limit must be positive integer')
      .min(1, 'Minimum limit must be 1')
      .max(100)
      .default(20),
  })
  .superRefine(({ sort, cursor }, ctx) => {
    if (!cursor) return;

    if (!sort) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['sort'],
        message: 'Sort is required when cursor is provided',
      });
      return;
    }

    const sortFields = new Set(sort.map((s) => s.field));

    for (const field of Object.keys(cursor)) {
      if (!sortFields.has(field)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cursor', field],
          message: `'${field}' is not present in sort`,
        });
      }
    }
  });

export type GetMoviesQuery = z.infer<typeof getMoviesParamsSchema>;

export type MovieSlugParam = {
  slug: string;
};

export type GetMoviesResponse = {
  movies: Movie[] | [];
  nextCursor: number | null;
};

export type CreateMovieResponse = {
  movieId: number | string;
};
