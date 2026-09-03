import type {
  CreateMovie,
  GetMoviesResponse,
  CreateMovieResponse,
} from '../types/dtos';
import MovieRepository from '../repositories/movie-repository';
import { QueryFilterObject } from '../utils/queryBuilder';
import redisClient from '../config/redis';

const movieRepository = new MovieRepository();

async function getMovies(
  filters?: QueryFilterObject[],
  cursor?: number,
  limit?: number
): Promise<GetMoviesResponse> {
  const movieLimit = limit ?? 20;
  const cursorId = cursor ?? 0;

  // const movies = await movieRepository.find(cursorId, movieLimit);
  if (!filters?.length && cursorId === 0) {
    const cachedMovies = await redisClient.get('movies:firstPage');
    if (cachedMovies) {
      return {
        movies: JSON.parse(cachedMovies),
        nextCursor: JSON.parse(cachedMovies).at(-1)?.id ?? null,
      };
    }
  }

  const movies = await movieRepository.findMovies({
    ...(filters ? { filters } : {}),
    sort: [{ field: 'id', order: 'ASC' }],
    cursor: { id: cursorId },
    limit: movieLimit,
  });

  if (!filters?.length && cursorId === 0)
    redisClient.set('movies:firstPage', JSON.stringify(movies), { EX: 60 });

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
