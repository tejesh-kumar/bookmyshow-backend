import express from 'express';
import { BookingController } from '../../controllers';
import authenticateUser from '../../middlewares/auth-middleware';

const router = express.Router();

router.post('/', authenticateUser, BookingController.createBooking);

router.get('/', authenticateUser, BookingController.getBookings);

export default router;
