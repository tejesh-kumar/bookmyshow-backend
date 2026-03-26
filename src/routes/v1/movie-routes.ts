import express from 'express';
import { MovieController } from '../../controllers';
import asyncHandler from '../../utils/asyncHandler';
// import globalErrorHandler from '../../utils/errors/globalErrorHandler';

const router = express.Router();

router.get('/', asyncHandler(MovieController.getMovies));

router.post('/', MovieController.createMovie);

// router.use(globalErrorHandler);

export default router;
