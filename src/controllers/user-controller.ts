import { Request, Response } from 'express';
import { UserService } from '../services';
import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/response';

export async function createUser(req: Request, res: Response) {
  const data = await UserService.createUser(req.body);
  return res.status(StatusCodes.CREATED).json(
    SuccessResponse({
      message: 'User registered successfully',
      data,
    })
  );
}
