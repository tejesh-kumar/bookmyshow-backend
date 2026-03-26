import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Movie } from '../models/movie-model';
import db from '../db/mysql';
import type { CreateMovie } from '../types/dtos';

class MovieRepository {
  async create(movie: CreateMovie): Promise<any | null> {
    const sql = `INSERT INTO movies (name, shortDescription, longDescription, coverImage, images, videos, duration, genres, languages, releaseDate, filmCertificate, cast, crew) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.execute<ResultSetHeader>(sql, [
      movie.name,
      movie.shortDescription,
      movie.longDescription,
      movie.coverImage,
      JSON.stringify(movie.images),
      JSON.stringify(movie.videos),
      movie.duration,
      JSON.stringify(movie.genres),
      JSON.stringify(movie.languages),
      movie.releaseDate,
      movie.filmCertificate,
      JSON.stringify(movie.cast),
      JSON.stringify(movie.crew),
    ]);

    console.log(result);

    return result;
  }

  async find(): Promise<Movie[] | null> {
    const sql = 'SELECT * FROM movies';

    const [rows] = await db.execute<RowDataPacket[] & Movie[]>(sql, []);

    return rows;
  }

  async findById(id: number): Promise<Movie | null> {
    const sql = `SELECT * FROM movies WHERE id=?`;

    const [result] = await db.execute<RowDataPacket[] & Movie[]>(sql, [id]);

    return result?.[0] ?? null;
  }

  async deleteById(id: number): Promise<number | null> {
    const sql = `DELETE * FROM movies WHERE id=?`;

    const [result] = await db.execute<ResultSetHeader>(sql, [id]);

    return result?.insertId ?? null;
  }
}

export default MovieRepository;
