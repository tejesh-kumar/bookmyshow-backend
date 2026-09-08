import express from 'express';
import { BookingController } from '../../controllers';

const router = express.Router();

router.post('/', BookingController.createBooking);

export default router;
