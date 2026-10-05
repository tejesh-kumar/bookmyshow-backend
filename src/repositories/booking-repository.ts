import { RowDataPacket } from 'mysql2';
import db from '../db/mysql';
import BaseRepository from './baseRepository';
import { Booking } from '../types/dtos';

class BookingRepository extends BaseRepository<Booking> {
  constructor() {
    super(db, 'booking');
  }

  async findBookingsByUser(userId: string): Promise<Booking[]> {
    const sql = `SELECT * FROM booking WHERE userId=?`;
    const [rows] = await db.execute<RowDataPacket[] & Booking[]>(sql, [userId]);
    return rows;
  }
}

export default BookingRepository;
