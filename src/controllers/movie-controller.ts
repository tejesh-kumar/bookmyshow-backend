import { Request, Response } from 'express';
import MovieService from '../services/movie-service';
import asyncHandler from '../utils/asyncHandler';
import { SuccessResponse } from '../utils/response';
import { StatusCodes } from 'http-status-codes';
import { GetMoviesQuery } from '../types/dtos';

export async function getMovies(req: Request, res: Response) {
  const { cursor, limit } = req.query as unknown as GetMoviesQuery;
  const { movies, nextCursor } = await MovieService.getMovies(cursor, limit);
  res.status(StatusCodes.OK).json(
    SuccessResponse({
      message: 'Movies fetched successfully',
      data: movies,
      metaData: { nextCursor, length: movies?.length },
    })
  );
}

export const createMovie = asyncHandler(async (req: Request, res: Response) => {
  const data = await MovieService.createMovie(req.body);
  return res.status(StatusCodes.CREATED).json(
    SuccessResponse({
      message: 'Movie created successfully',
      data,
    })
  );
});
