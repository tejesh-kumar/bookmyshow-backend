import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../utils/asyncHandler';
import { SuccessResponse } from '../utils/response';
import { BookingService } from '../services';
import { ShowIdParam } from '../types/dtos';

export async function holdSeats(req: Request<ShowIdParam>, res: Response) {
  const { showId } = req.params;
  const { seats } = req.body;
  const userId = 1; // replace userId after auth is implemented

  const data = await BookingService.holdSeats(showId, userId, seats);
  return res.status(StatusCodes.OK).json(
    SuccessResponse({
      message: 'Seats held successfully',
      data,
    })
  );
}

export const createBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await BookingService.createBooking(req.body);
    return res.status(StatusCodes.CREATED).json(
      SuccessResponse({
        message: 'Booking created successfully',
        data,
      })
    );
  }
);
