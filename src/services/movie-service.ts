import type {
  CreateMovie,
  GetMoviesResponse,
  CreateMovieResponse,
} from '../types/dtos';
import MovieRepository from '../repositories/movie-repository';

const movieRepository = new MovieRepository();

async function getMovies(
  cursor?: number,
  limit?: number
): Promise<GetMoviesResponse> {
  const movieLimit = limit ?? 20;
  const cursorId = cursor ?? 0;

  const movies = await movieRepository.find(cursorId, movieLimit);
  const nextCursor = movies.at(-1)?.id ?? null;
  return { movies, nextCursor };
}

async function createMovie(
  movieData: CreateMovie
): Promise<CreateMovieResponse> {
  const movieId = await movieRepository.create(movieData);
  return { movieId };
}

export default { createMovie, getMovies };
