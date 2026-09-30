import { getMovies, createMovie, deleteMovieBySlug } from './movie-controller';
import { createBooking, holdSeats, getBookings } from './booking-controller';
import {
  createUser,
  loginUser,
  logoutUser,
  refreshUserAuth,
} from './user-controller';

export const MovieController = {
  createMovie,
  getMovies,
  deleteMovieBySlug,
};

export const BookingController = {
  createBooking,
  holdSeats,
  getBookings,
};

export const UserController = {
  createUser,
  loginUser,
  logoutUser,
  refreshUserAuth,
};
