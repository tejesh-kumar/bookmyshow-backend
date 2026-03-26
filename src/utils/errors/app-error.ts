import { StatusCodes } from 'http-status-codes';

class AppError extends Error {
  statusCode: number;
  dbErrorCode: string;
  details: string[];

  constructor(
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    message: string = 'Something went wrong',
    code?: string,
    details?: string[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.dbErrorCode = code ?? '';
    this.details = details ?? [];
  }
}

export class ValidationError extends AppError {
  fields = [];

  constructor(message: string = 'Validation failed', validationErrors: []) {
    super(StatusCodes.BAD_REQUEST, message);
    this.fields = validationErrors;
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request') {
    super(StatusCodes.BAD_REQUEST, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(StatusCodes.UNAUTHORIZED, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(StatusCodes.NOT_FOUND, message);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Internal Server Error', details: any) {
    super(StatusCodes.INTERNAL_SERVER_ERROR, message, details);
  }
}

export default AppError;
