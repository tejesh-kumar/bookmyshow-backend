import express from 'express';
import { BookingController } from '../../controllers';

const router = express.Router();

router.post('/:showId/hold', BookingController.holdSeats);

export default router;
