import redisClient from '../config/redis';
import db from '../db/mysql';
import { bookingSchema, bookingSeatsSchema } from '../models/booking-model';
import BookingRepository from '../repositories/booking-repository';
import BookingSeatRepository from '../repositories/bookingSeat-repository';
import {
  CreateBooking,
  CreateBookingResponse,
  NonEmptyArray,
} from '../types/dtos';
import { ConflictError } from '../utils/errors/app-error';

const bookingRepository = new BookingRepository();
const bookingSeatRepository = new BookingSeatRepository();

function generateSeatHoldKey(showId: number, seatId: string): string {
  return `seat:hold:${showId}:${seatId}`;
}

async function holdSeats(showId: number, userId: number, seats: string[]) {
  const seatHoldKeys = seats.map((seatId: string) =>
    generateSeatHoldKey(showId, seatId)
  );

  const response = await redisClient.EVAL(
    `    
        for _, key in ipairs(KEYS) do
            local doesUserExist = redis.call('GET', key)
            if doesUserExist ~= false and doesUserExist ~= nil then
                return false
            end
        end

        for _, key in ipairs(KEYS) do
            redis.call('SET', key, ARGV[1], 'NX', 'EX', ARGV[2])
        end
        return true
        `,
    { keys: seatHoldKeys, arguments: [String(userId), '300'] } // 300 seconds = 5 minutes
  );
  if (!response) {
    throw new ConflictError(
      'One or more selected seats are no longer available.',
      seats
    );
  }
  return seats;
}

async function createBooking(
  bookingData: CreateBooking
): Promise<CreateBookingResponse> {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const booking = bookingSchema
      .omit({ id: true, bookingDateTime: true, updatedAt: true })
      .parse(bookingData);

    const bookingId = await bookingRepository.create(booking, connection);

    const bookingSeats = bookingData.seats.map((seat) => ({
      ...seat,
      bookingId: Number(bookingId),
      showId: bookingData.showId,
      userId: bookingData.userId,
    }));

    const bookingSeatsId = await bookingSeatRepository.createMany(
      bookingSeats as NonEmptyArray<any>,
      connection
    );

    return { bookingId, bookingSeatsId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export default { holdSeats, createBooking };
