import { RowDataPacket } from 'mysql2/promise';
import 'dotenv/config';

import db from '../db/mysql';
import { InitializeConfig } from '../server-config';
import tableSeeder, { clearTable } from './seederUtil';

InitializeConfig();

interface LanguageRow extends RowDataPacket {
  id: number;
}

async function seedMovieLanguagesRecords(numberOfRecords: number) {
  let seederArray = [];
  const [languageRes] = await db.execute<LanguageRow[]>(
    'SELECT id FROM languages ORDER BY id LIMIT 5',
    []
  );
  const [movieRes] = await db.execute<RowDataPacket[]>(
    'SELECT id from movies ORDER BY id LIMIT 30',
    []
  );
  const languageIds = languageRes?.map((lang) => lang.id);
  const movieIds = movieRes?.map((movie) => movie.id);

  for (const movieId of movieIds) {
    for (const languageId of languageIds) {
      seederArray.push({
        movieId,
        languageId,
      });
    }
  }

  const shuffled = seederArray.sort(() => Math.random() - 0.5);
  const result = shuffled.slice(0, numberOfRecords);

  console.dir({ result, seederArray, languageIds, movieIds }, { depth: null });

  tableSeeder('movieLanguages', result);
}

seedMovieLanguagesRecords(100);

// clearTable('movieLanguages');
