import AppError, { ValidationError } from '../errors/app-error';
import { ErrorResponse } from '../response';

export const errorResponseObj = (err: any) => {
  // Normalize different error shapes into the ErrorResponse shape

  if (err instanceof ValidationError) {
    return ErrorResponse({
      message: err?.message || 'Validation failed',
      error: { fields: err?.fields || [] },
    });
  }

  if (err instanceof AppError) {
    return ErrorResponse({
      message: err?.message || 'Error',
      error: {
        code: err?.dbErrorCode || undefined,
        details: err?.details || [],
      },
    });
  }

  // Fallback
  return ErrorResponse({
    message: err?.message || 'Something went wrong',
    error: {},
  });
};
