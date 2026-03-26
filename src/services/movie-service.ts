import { Movie } from '../models/movie-model';
import MovieRepository from '../repositories/movie-repository';
import { CreateMovie } from '../types/dtos';

const movieRepository = new MovieRepository();

async function getMovies(): Promise<Movie[] | null> {
  const response: Movie[] | null = await movieRepository.find();
  return response;
}

async function createMovie(
  movieData: CreateMovie
): Promise<any | null | string> {
  const response: any | null = await movieRepository.create(movieData);
  console.log(response);
  return response;
}

export default { createMovie, getMovies };
