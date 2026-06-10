import type { Movie, CreateMovie } from '../types/dtos';
import MovieRepository from '../repositories/movie-repository';

const movieRepository = new MovieRepository();

async function getMovies(): Promise<Movie[] | null> {
  const movies: Movie[] | null = await movieRepository.find();
  return movies;
}

async function createMovie(
  movieData: CreateMovie
): Promise<any | null | string> {
  const movieId: string = await movieRepository.create(movieData);
  return { movieId };
}

export default { createMovie, getMovies };
