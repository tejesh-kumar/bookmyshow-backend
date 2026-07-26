import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2';
import db from '../db/mysql';
import type { Movie, CreateMovie } from '../types/dtos';
import BaseRepository from './baseRepository';
import SqlQueryBuilder, {
  QueryFilterObject,
  WhereClauses,
} from '../utils/queryBuilder';

// class MovieRepository {
//   async create(movie: CreateMovie): Promise<number> {
//     const sql = `INSERT INTO movies (name, slug, shortDescription, longDescription, coverImage, images, videos, duration, releaseDate, filmCertificate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//     const [result] = await db.execute<ResultSetHeader>(sql, [
//       movie.name,
//       movie.slug,
//       movie.shortDescription,
//       movie.longDescription,
//       movie.coverImage,
//       JSON.stringify(movie.images),
//       JSON.stringify(movie.videos),
//       movie.duration,
//       movie.releaseDate,
//       movie.filmCertificate,
//     ]);

//     return result?.insertId;
//   }

//   async find(cursor: number, limit: number): Promise<Movie[]> {
//     const sql = 'SELECT * FROM movies WHERE id > ? ORDER BY id ASC LIMIT ?';

//     const [rows] = await db.execute<RowDataPacket[] & Movie[]>(sql, [
//       cursor,
//       limit,
//     ]);

//     return rows;
//   }

//   async findById(id: number): Promise<Movie | null> {
//     const sql = `SELECT * FROM movies WHERE id=?`;

//     const [result] = await db.execute<RowDataPacket[] & Movie[]>(sql, [id]);

//     return result?.[0] ?? null;
//   }

//   async deleteById(id: number): Promise<number | null> {
//     const sql = `DELETE * FROM movies WHERE id=?`;

//     const [result] = await db.execute<ResultSetHeader>(sql, [id]);

//     return result?.insertId ?? null;
//   }
// }

const queryBuilder = new SqlQueryBuilder();

function getFilterInfo(
  filters: QueryFilterObject[] | undefined,
  field: string
) {
  const values =
    (filters?.find((filter) => filter.field === field)?.value as string[]) ??
    [];

  return {
    values,
    placeholders: values.map(() => '?').join(', '),
  };
}

class MovieRepository extends BaseRepository<Movie> {
  constructor() {
    super(db, 'movies');
  }

  async findMovies(whereClauses: WhereClauses) {
    const { filters, sort, cursor, limit } = whereClauses;
    const isCursorClauseRequired = sort?.length || cursor?.length;
    const languageFilter = getFilterInfo(filters, 'languages');
    const genreFilter = getFilterInfo(filters, 'genres');

    const { queryString: cursorClauseString, values: cursorClauseValues } =
      queryBuilder.compositeCursorBuilder(cursor, sort);
    const { queryString: limitString, values: limitValues } =
      queryBuilder.limitClauseBuilder(limit);

    const values = [
      ...languageFilter?.values,
      ...genreFilter?.values,
      ...cursorClauseValues,
      ...limitValues,
    ];

    const sql = `
                  WITH
                    languageData AS (
                      SELECT
                        movieId,
                        JSON_ARRAYAGG(name) AS languages
                      FROM
                        movieLanguages ml
                        JOIN languages l ON ml.languageId = l.id
                      ${
                        languageFilter?.values?.length
                          ? `WHERE
                        l.name IN (${languageFilter?.placeholders})`
                          : ''
                      }
                      GROUP BY
                        movieId
                    ),
                    genreData AS (
                      SELECT
                        movieId,
                        JSON_ARRAYAGG(name) AS genres
                      FROM
                        movieGenres mg
                        JOIN genres g ON mg.genreId = g.id
                      ${
                        genreFilter?.values?.length
                          ? `WHERE
                        g.name IN (${genreFilter?.placeholders})`
                          : ''
                      }
                      GROUP BY
                        movieId
                    )
                  SELECT
                    m.*,
                    languageData.languages,
                    genreData.genres
                  FROM
                    movies m
                    JOIN languageData ON m.id = languageData.movieId
                    JOIN genreData ON m.id = genreData.movieId 
                    ${isCursorClauseRequired && `WHERE ${cursorClauseString}`}
                    ${limit && limitString}
`;

    const [rows] = await db.query(sql, values);
    return rows as Movie[];
  }

  async deleteMovieBySlug(slug: string): Promise<number> {
    const sql = `DELETE FROM movies WHERE slug = ?`;
    const [result] = await this.db.execute<ResultSetHeader & Movie>(sql, [
      slug,
    ]);
    return result?.affectedRows;
  }
}

export default MovieRepository;
