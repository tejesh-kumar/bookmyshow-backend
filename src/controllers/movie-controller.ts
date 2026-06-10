import { Request, Response } from 'express';
import MovieService from '../services/movie-service';
import asyncHandler from '../utils/asyncHandler';
import { SuccessResponse } from '../utils/response';
import { StatusCodes } from 'http-status-codes';

export async function getMovies(req: Request, res: Response) {
  const data = await MovieService.getMovies();
  res
    .status(StatusCodes.OK)
    .json(
      SuccessResponse({
        message: 'Movies fetched successfully',
        data: data || [],
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
