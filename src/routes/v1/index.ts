import express from 'express';

import catalogRoutes from './catalog-routes';
import movieRoutes from './movie-routes';
import bookingRoutes from './booking-routes';
import seatHoldRoutes from './seatHold-routes';

const router = express.Router();

router.use('/catalog', catalogRoutes);

router.use('/movies', movieRoutes);
router.use('/shows', seatHoldRoutes);
router.use('/booking', bookingRoutes);

export default router;
