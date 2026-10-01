import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors/app-error';
import { verifyJwtTokenAndGetUser } from '../utils/jwt';

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const { accessToken } = req.cookies;

  // console.dir({ accessToken, refreshToken }, { depth: null });

  if (!accessToken) throw new UnauthorizedError('Access token is missing');

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
