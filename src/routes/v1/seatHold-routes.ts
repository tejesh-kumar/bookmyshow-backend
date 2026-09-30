import express from 'express';
import { BookingController } from '../../controllers';
import authenticateUser from '../../middlewares/auth-middleware';

const router = express.Router();

router.post('/:showId/hold', authenticateUser, BookingController.holdSeats);

export default router;
