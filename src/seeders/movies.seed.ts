import { CreateMovie } from '../types/dtos';
import tableSeeder from './seederUtil';
import fs from 'fs';

const externalMovies: any[] = JSON.parse(
  fs.readFileSync('./src/movies.json', 'utf-8')
);

const getMovieDurationInMinutes = (): number => {
  const totalMinutes = Math.random() * 120 + 60; // Random duration between 60 and 180 minutes
  return Math.round(totalMinutes);
};

const getFilmCertificate = (): string => {
  const certificates = ['U', 'UA', 'A'];
  const index = Math.floor(Math.random() * certificates.length);
  return (certificates[index] ?? certificates[0]) as string;
};

const movies = externalMovies.map((movie: CreateMovie) => ({
  name: movie.name,
  slug: movie.slug,
  shortDescription: movie.shortDescription,
  longDescription: movie.longDescription,
  releaseDate: movie.releaseDate,
  coverImage: movie.coverImage,
  images: [],
  videos: [],
  duration: movie.duration || getMovieDurationInMinutes(),
  filmCertificate: movie.filmCertificate || getFilmCertificate(),
}));

tableSeeder('movies', movies);
