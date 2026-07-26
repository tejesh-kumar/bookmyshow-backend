export const selectRandomElement = (array: Array<number>): number | string =>
  Math.ceil(Math.random() * array.length);
