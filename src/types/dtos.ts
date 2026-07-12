// dtos/CreateMovie.ts
import { z } from 'zod';

import {
  createMovieSchema,
  movieSchema,
  updateMovieSchema,
} from '../models/movie-model';

export type Movie = z.infer<typeof movieSchema>;
export type CreateMovie = z.infer<typeof createMovieSchema>;
export type UpdateMovie = z.infer<typeof updateMovieSchema>;

export const getMoviesParamsSchema = z.object({
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

export type GetMoviesQuery = z.infer<typeof getMoviesParamsSchema>;

export type GetMoviesResponse = {
  movies: Movie[] | [];
  nextCursor: number | null;
};

export type CreateMovieResponse = {
  movieId: number;
};
