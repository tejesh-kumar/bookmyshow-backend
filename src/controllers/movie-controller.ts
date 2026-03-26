import { Request, Response } from 'express';
import MovieService from '../services/movie-service';
import asyncHandler from '../utils/asyncHandler';

export async function getMovies(req: Request, res: Response) {
  const movies = await MovieService.getMovies();
  res.json(movies);
}

export const createMovie = asyncHandler(async (req: Request, res: Response) => {
  const response = await MovieService.createMovie(req.body);
  return res.json(response);
});
