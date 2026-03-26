import express from 'express';

import catalogRoutes from './catalog-routes';
import movieRoutes from './movie-routes';

const router = express.Router();

router.use('/catalog', catalogRoutes);

router.use('/movies', movieRoutes);

export default router;
