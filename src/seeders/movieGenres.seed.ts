import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import 'dotenv/config';

import db from '../db/mysql';
import { InitializeConfig } from '../server-config';
import tableSeeder, { clearTable } from './seederUtil';

InitializeConfig();

interface GenreRow extends RowDataPacket {
  id: number;
}

async function seedMovieGenresRecords(numberOfRecords: number) {
  let seederArray = [];
  const [genreRes] = await db.execute<GenreRow[]>(
    'SELECT id FROM genres ORDER BY id',
    []
  );
  const [movieRes] = await db.execute<RowDataPacket[]>(
    'SELECT id from movies ORDER BY id LIMIT 30',
    []
  );
  const genreIds = genreRes?.map((lang) => lang.id);
  const movieIds = movieRes?.map((movie) => movie.id);

  for (const movieId of movieIds) {
    for (const genreId of genreIds) {
      seederArray.push({
        movieId,
        genreId,
      });
    }
  }

  const shuffled = seederArray.sort(() => Math.random() - 0.5);
  const result = shuffled.slice(0, numberOfRecords);

  console.dir({ result, seederArray, genreIds, movieIds }, { depth: null });

  tableSeeder('movieGenres', result);
}

seedMovieGenresRecords(100);

// clearTable('movieGenres');
