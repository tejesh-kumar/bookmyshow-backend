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
