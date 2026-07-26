import type {
  CreateMovie,
  GetMoviesResponse,
  CreateMovieResponse,
} from '../types/dtos';
import MovieRepository from '../repositories/movie-repository';
import { QueryFilterObject } from '../utils/queryBuilder';

const movieRepository = new MovieRepository();

async function getMovies(
  filters?: QueryFilterObject[],
  cursor?: number,
  limit?: number
): Promise<GetMoviesResponse> {
  const movieLimit = limit ?? 20;
  const cursorId = cursor ?? 0;

  // const movies = await movieRepository.find(cursorId, movieLimit);
  const movies = await movieRepository.findMovies({
    ...(filters ? { filters } : {}),
    sort: [{ field: 'id', order: 'ASC' }],
    cursor: { id: cursorId },
    limit: movieLimit,
  });
  const nextCursor = movies.at(-1)?.id ?? null;
  return { movies, nextCursor };
}

async function createMovie(
  movieData: CreateMovie
): Promise<CreateMovieResponse> {
  const movieId = await movieRepository.create(movieData);
  return { movieId };
}

async function deleteMovieBySlug(slug: string): Promise<number> {
  const res = await movieRepository.deleteMovieBySlug(slug);
  return res;
}

export default { createMovie, getMovies, deleteMovieBySlug };
