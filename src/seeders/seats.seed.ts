import fs from 'fs';

import tableSeeder from './seederUtil';

const seats: any[] = JSON.parse(fs.readFileSync('./src/seats.json', 'utf-8'));

const BATCH_SIZE = 1000;

for (let i = 0; i < seats?.length; i += BATCH_SIZE) {
  const batch = seats.slice(i, i + BATCH_SIZE);
  tableSeeder('cinemaSeats', batch);
}
