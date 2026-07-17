import express from 'express';
import { MovieController } from '../../controllers';
import asyncHandler from '../../utils/asyncHandler';
import { validate } from '../../utils/validator';
import {
  createMovieSchema,
  deleteMovieBySlugSchema,
} from '../../models/movie-model';
import { getMoviesParamsSchema } from '../../types/dtos';
// import globalErrorHandler from '../../utils/errors/globalErrorHandler';

const router = express.Router();

router.get(
  '/',
  validate(getMoviesParamsSchema, 'query'),
  asyncHandler(MovieController.getMovies)
);

router.post('/', validate(createMovieSchema), MovieController.createMovie);

router.delete(
  '/:slug',
  validate(deleteMovieBySlugSchema, 'params'),
  MovieController.deleteMovieBySlug
);

// router.use(globalErrorHandler);

export default router;
