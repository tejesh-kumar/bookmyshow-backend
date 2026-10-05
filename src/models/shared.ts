import { z } from 'zod';

const dateTimeSchema = z.union([
  z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/,
      'Invalid MySQL DATETIME(3)'
    ),
  z.iso.datetime(),
]);

export { dateTimeSchema };
