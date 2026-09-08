import { RowDataPacket } from 'mysql2';
import db from '../db/mysql';
import BaseRepository from './baseRepository';
import { Booking } from '../types/dtos';

class BookingRepository extends BaseRepository<Booking> {
  constructor() {
    super(db, 'booking');
  }

  async findBookingsByUser(userId: number): Promise<Booking[]> {
    const sql = `SELECT * FROM bookings WHERE userId=?`;
    const [rows] = await db.execute<RowDataPacket[] & Booking[]>(sql, [userId]);
    return rows;
  }
}

export default BookingRepository;
