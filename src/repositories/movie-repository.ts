import { ResultSetHeader, RowDataPacket } from 'mysql2';
import db from '../db/mysql';
import type { Movie, CreateMovie } from '../types/dtos';

class MovieRepository {
  async create(movie: CreateMovie): Promise<number> {
    const sql = `INSERT INTO movies (name, slug, shortDescription, longDescription, coverImage, images, videos, duration, releaseDate, filmCertificate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.execute<ResultSetHeader>(sql, [
      movie.name,
      movie.slug,
      movie.shortDescription,
      movie.longDescription,
      movie.coverImage,
      JSON.stringify(movie.images),
      JSON.stringify(movie.videos),
      movie.duration,
      movie.releaseDate,
      movie.filmCertificate,
    ]);

    return result?.insertId;
  }

  async find(cursor: number, limit: number): Promise<Movie[]> {
    const sql = 'SELECT * FROM movies WHERE id > ? ORDER BY id ASC LIMIT ?';

    const [rows] = await db.execute<RowDataPacket[] & Movie[]>(sql, [
      cursor,
      limit,
    ]);

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
