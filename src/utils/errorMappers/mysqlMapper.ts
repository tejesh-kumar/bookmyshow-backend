import { StatusCodes } from 'http-status-codes';
import { ErrorResponse } from '../response';

export function extractMysqlField(err: any) {
  const message = err?.sqlMessage || '';

  const patterns = [
    /Column '(.+?)'/, // Column 'email'
    /Field '(.+?)'/, // Field 'email'
    /for column '(.+?)'/, // for column 'title'
    /key '(.+?)'/, // key 'users.username'
    /FOREIGN KEY \(`(.+?)`\)/, // FOREIGN KEY (`genreId`)
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export const mapMySqlErrorCodes: { [key: string]: string } = {
  ER_DUP_ENTRY: 'DUPLICATE_RESOURCE',
  ER_NO_REFERENCED_ROW_2: 'INVALID_REFERENCE',
  ER_ROW_IS_REFERENCED_2: 'RESOURCE_IN_USE',
  ER_BAD_NULL_ERROR: 'NULL_VIOLATION',
  ER_DATA_TOO_LONG: 'DATA_TOO_LONG',
  ER_TRUNCATED_WRONG_VALUE: 'INVALID_VALUE',
  ER_NO_DEFAULT_FOR_FIELD: 'MISSING_FIELD',
  PROTOCOL_CONNECTION_LOST: 'DB_UNAVAILABLE',
  ECONNREFUSED: 'DB_UNAVAILABLE',
};

export const mapMySqlDefaultErrorMessages: { [key: string]: string } = {
  ER_DUP_ENTRY: 'Resource already exists',
  ER_NO_REFERENCED_ROW_2: 'Invalid reference',
  ER_ROW_IS_REFERENCED_2: 'Resource is referenced elsewhere',
  ER_BAD_NULL_ERROR: 'Required field cannot be null',
  ER_DATA_TOO_LONG: 'Input too long',
  ER_TRUNCATED_WRONG_VALUE: 'Invalid value',
  ER_NO_DEFAULT_FOR_FIELD: 'Required field missing',
  PROTOCOL_CONNECTION_LOST: 'Database unavailable',
  ECONNREFUSED: 'Database unavailable',
};

export const mapMySqlErrorMessages = (errCode: string, errField: string) => {
  const messages: { [key: string]: string } = {
    ER_DUP_ENTRY: `${errField} already exists`,
    ER_NO_REFERENCED_ROW_2: `${errField} does not exist`,
    ER_ROW_IS_REFERENCED_2: `Cannot be deleted ${errField} as already in use`,
    ER_BAD_NULL_ERROR: `${errField} cannot be empty`,
    ER_DATA_TOO_LONG: `${errField} exceeds maximum length`,
    ER_TRUNCATED_WRONG_VALUE: `Invalid value for ${errField}`,
    ER_NO_DEFAULT_FOR_FIELD: `${errField} is required`,
    PROTOCOL_CONNECTION_LOST: 'Database unavailable',
    ECONNREFUSED: 'Database unavailable',
  };
  return messages[errCode];
};

export const mapMySqlErrorCodesToStatusCodes = (errCode: string) => {
  const statusCodes: { [key: string]: number } = {
    ER_DUP_ENTRY: StatusCodes.CONFLICT,
    ER_NO_REFERENCED_ROW_2: StatusCodes.BAD_REQUEST,
    ER_ROW_IS_REFERENCED_2: StatusCodes.CONFLICT,
    ER_BAD_NULL_ERROR: StatusCodes.BAD_REQUEST,
    ER_DATA_TOO_LONG: StatusCodes.BAD_REQUEST,
    ER_TRUNCATED_WRONG_VALUE: StatusCodes.BAD_REQUEST,
    ER_NO_DEFAULT_FOR_FIELD: StatusCodes.BAD_REQUEST,
    PROTOCOL_CONNECTION_LOST: StatusCodes.SERVICE_UNAVAILABLE,
    ECONNREFUSED: StatusCodes.SERVICE_UNAVAILABLE,
  };
  return statusCodes[errCode];
};

export const mapMySqlError = (err: any) => {
  const errField = extractMysqlField(err);

  const errCode = mapMySqlErrorCodes[err.code] || 'DATABASE_ERROR';
  const errorMessage =
    mapMySqlErrorMessages(err?.code, errField) ||
    mapMySqlDefaultErrorMessages[err.code] ||
    'Database error';
  const statusCode =
    mapMySqlErrorCodesToStatusCodes(err.code) ||
    StatusCodes.INTERNAL_SERVER_ERROR;

  const errObj = ErrorResponse({
    message: errorMessage,
    error: { code: errCode, ...(errField && { field: errField }) },
  });

  return { statusCode, errObj };
};
