import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors/app-error';
import { verifyJwtTokenAndGetUser } from '../utils/jwt';

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const { accessToken, csrfToken: cookieTokenCsrf } = req.cookies;
  const headerTokenCsrf = req.headers['x-csrf-token'];

  // console.dir({ accessToken, refreshToken }, { depth: null });

  if (!accessToken) throw new UnauthorizedError('Access token is missing');

  if (
    !cookieTokenCsrf ||
    !headerTokenCsrf ||
    cookieTokenCsrf !== headerTokenCsrf
  ) {
    throw new ForbiddenError('Invalid CSRF token');
  }

  const { payload, isValidToken } = verifyJwtTokenAndGetUser(accessToken);

  // Throws error if expired, tampered with, or signature is invalid
  if (!isValidToken) throw new UnauthorizedError('Access Token is invalid');

  req.user = {
    id: payload.userId,
    role: payload.role,
  };

  next();
};

export default authenticateUser;
