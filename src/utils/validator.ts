import { RequestHandler } from 'express';
import z from 'zod';
import { ValidationError } from './errors/app-error';
import { ValidationField } from '../types';

const getValidationErrors = (
  issues: z.ZodError['issues']
): ValidationField[] => {
  const errorList = issues?.map((issue) => {
    if (issue.code === 'unrecognized_keys') {
      return {
        field: issue.keys.join(', '),
        message: 'Unknown field(s) supplied',
      };
    }
    return {
      field: issue?.path?.join('.'),
      message: issue?.message,
    };
  });
  return errorList;
};

export function validate(schema: z.ZodTypeAny): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new ValidationError(
        'Validation failed',
        getValidationErrors(result.error.issues)
      );
    }

    req.body = result.data;
    next();
  };
}
