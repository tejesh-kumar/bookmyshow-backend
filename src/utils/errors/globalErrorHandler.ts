import { StatusCodes } from 'http-status-codes';
import AppError, { ValidationError } from './app-error';
import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../response';
import { mapMySqlError } from '../errorMappers/mysqlMapper';
import { errorResponseObj } from '../errorMappers/errorResponse.mapper';

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('err handler', err);

  // Database errors from MySQL
  if (err?.code && err?.sqlMessage) {
    const { statusCode, errObj } = mapMySqlError(err);
    return res.status(statusCode).json(errObj);
  }

  // Validation errors (custom ValidationError extends AppError)
  if (err instanceof ValidationError) {
    const errObj = errorResponseObj(err);
    return res.status(StatusCodes.BAD_REQUEST).json(errObj);
  }

  // Already an AppError (includes DatabaseError, NotFoundError, etc.)
  if (err instanceof AppError) {
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const errObj = errorResponseObj(err);
    return res.status(statusCode).json(errObj);
  }

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(ErrorResponse({ message: 'Internal Server Error', error: {} }));
};

export default globalErrorHandler;
