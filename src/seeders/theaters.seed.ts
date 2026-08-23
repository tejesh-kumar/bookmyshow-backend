import fs from 'fs';

import tableSeeder from './seederUtil';

const externalTheaters: any[] = JSON.parse(
  fs.readFileSync('./src/theaters.json', 'utf-8')
);

tableSeeder('cinemas', externalTheaters);
