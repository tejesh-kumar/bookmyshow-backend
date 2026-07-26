import { Request, Response } from 'express';
import MovieService from '../services/movie-service';
import asyncHandler from '../utils/asyncHandler';
import { SuccessResponse } from '../utils/response';
import { StatusCodes } from 'http-status-codes';
import { GetMoviesQuery, MovieSlugParam } from '../types/dtos';

const getFilters = (filterString: string) => {
  const filter = filterString.split('|');
  if (filter?.length === 1) return [filterString];
  return filter;
};

export async function getMovies(req: Request, res: Response) {
  const { languages, genres, cursor, limit } = req.validated
    .query as unknown as GetMoviesQuery;
  let filters = [];
  if (languages) {
    filters.push({
      field: 'languages',
      value: getFilters(languages),
      operator: '=',
    });
  }
  if (genres) {
    filters.push({ field: 'genres', value: getFilters(genres), operator: '=' });
  }
  const { movies, nextCursor } = await MovieService.getMovies(
    filters,
    cursor,
    limit
  );
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

export async function deleteMovieBySlug(
  req: Request<MovieSlugParam>,
  res: Response
) {
  const { slug } = req.params;
  const data = await MovieService.deleteMovieBySlug(slug);
  return res.status(StatusCodes.OK).json(
    SuccessResponse({
      message: 'Movie deleted successfully',
      data,
    })
  );
}
