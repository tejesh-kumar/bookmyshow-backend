import express from 'express';
import { MovieController } from '../../controllers';
import asyncHandler from '../../utils/asyncHandler';
import { validate } from '../../utils/validator';
import { createMovieSchema } from '../../models/movie-model';
// import globalErrorHandler from '../../utils/errors/globalErrorHandler';

const router = express.Router();

router.get('/', asyncHandler(MovieController.getMovies));

router.post('/', validate(createMovieSchema), MovieController.createMovie);

// router.use(globalErrorHandler);

export default router;
