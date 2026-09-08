import { z } from 'zod';

const dateTimeSchema = z.union([
  z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/,
      'Invalid MySQL DATETIME(3)'
    ),
  z.iso.datetime(),
]);

const bookingSchema = z.object({
  id: z.number().int().positive(),
  bookingReference: z.string().trim().min(2).max(100),
  showId: z.number().int().positive(),
  userId: z.number().int().positive(),
  bookingStatus: z.enum(['confirmed', 'cancelled']),
  paymentId: z.number().int().positive(),
  bookingDateTime: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

const bookingSeatsSchema = z.object({
  id: z.number().int().positive(),
  bookingId: z.number().int().positive(),
  seatId: z.number().int().positive(),
  seatNumber: z.string().trim().min(1).max(10),
  showId: z.number().int().positive(),
  userId: z.number().int().positive(),
  price: z.number().int().positive(),
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

const createBookingSchema = bookingSchema
  .omit({
    id: true,
    bookingDateTime: true,
    updatedAt: true,
  })
  .safeExtend({
    seats: z.array(
      z.object({
        seatId: z.number().int().positive(),
        seatNumber: z.string().trim().min(1),
        price: z.number().positive(),
      })
    ),
  });

const createBookingSeatsSchema = bookingSeatsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export {
  bookingSchema,
  createBookingSchema,
  bookingSeatsSchema,
  createBookingSeatsSchema,
};
