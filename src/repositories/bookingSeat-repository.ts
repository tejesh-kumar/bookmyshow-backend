import db from '../db/mysql';
import BaseRepository from './baseRepository';
import { BookingSeats } from '../types/dtos';

class BookingSeatRepository extends BaseRepository<BookingSeats> {
  constructor() {
    super(db, 'bookingSeats');
  }
}

export default BookingSeatRepository;
