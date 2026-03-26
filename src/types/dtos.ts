// dtos/CreateMovie.ts
import { Movie } from '../models/movie-model';

export type CreateMovie = Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>;
