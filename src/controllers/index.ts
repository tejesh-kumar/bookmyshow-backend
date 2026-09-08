import { getMovies, createMovie, deleteMovieBySlug } from './movie-controller';
import { createBooking, holdSeats } from './booking-controller';

export const MovieController = {
  createMovie,
  getMovies,
  deleteMovieBySlug,
};

export const BookingController = {
  createBooking,
  holdSeats,
};
