import tableSeeder from './seederUtil';

const genres: { code: string; name: string }[] = [
  { code: 'action', name: 'Action' },
  { code: 'drama', name: 'Drama' },
  { code: 'comedy', name: 'Comedy' },
  { code: 'thriller', name: 'Thriller' },
  { code: 'romance', name: 'Romance' },
  { code: 'horror', name: 'Horror' },
  { code: 'sci_fi', name: 'Sci-Fi' },
];

tableSeeder('genres', genres);
