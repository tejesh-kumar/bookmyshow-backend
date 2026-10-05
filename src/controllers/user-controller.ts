import { Request, Response } from 'express';
import { UserService } from '../services';
import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response';
import { verifyJwtTokenAndGetUser } from '../utils/jwt';
import { ConflictError } from '../utils/errors/app-error';

export async function createUser(req: Request, res: Response) {
  const data = await UserService.createUser(req.body);
  return res.status(StatusCodes.CREATED).json(
    SuccessResponse({
      message: 'User registered successfully',
      data,
    })
  );
}

export async function loginUser(req: Request, res: Response) {
  const { accessToken: accessTokenInCookie } = req.cookies;
  if (accessTokenInCookie) {
    const { isValidToken } =
      await verifyJwtTokenAndGetUser(accessTokenInCookie);
    if (isValidToken) throw new ConflictError('User already logged in');
  }

  const { refreshToken, accessToken, csrfToken } = await UserService.login(
    req.body
  );
  return res
    .status(StatusCodes.OK)
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000, // 10 min
      path: '/',
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      path: '/v1/auth/refresh',
    })
    .cookie('csrfToken', csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    .json(
      SuccessResponse({
        message: 'User logged in successfully',
      })
    );
}

export async function logoutUser(req: Request, res: Response) {
  await UserService.logout(req.body);
  return res
    .status(StatusCodes.OK)
    .clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000, // 10 min
      path: '/',
    })
    .clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      path: '/auth/refresh',
    })
    .clearCookie('csrfToken', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    .json(
      SuccessResponse({
        message: 'User logged out successfully',
      })
    );
}

export async function refreshUserAuth(req: Request, res: Response) {
  const { refreshToken } = req.cookies;
  const accessToken =
    await UserService.validateAndRefreshAccessToken(refreshToken);
  return res
    .status(StatusCodes.OK)
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000, // 10 min
      path: '/',
    })
    .json(SuccessResponse({ message: 'Token refreshed successfully' }));
}
