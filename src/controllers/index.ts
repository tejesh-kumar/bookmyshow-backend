import { getMovies, createMovie, deleteMovieBySlug } from './movie-controller';
import { createBooking, holdSeats } from './booking-controller';
import { createUser } from './user-controller';

export const MovieController = {
  createMovie,
  getMovies,
  deleteMovieBySlug,
};

export const BookingController = {
  createBooking,
  holdSeats,
};

export const UserController = {
  createUser,
};
