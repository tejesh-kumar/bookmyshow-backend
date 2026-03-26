import { Request, Response, NextFunction, RequestHandler } from 'express';

const asyncHandler = function (fn: RequestHandler): RequestHandler {
  // This is what Express eventually runs
  return function (req: Request, res: Response, next: NextFunction) {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// const asyncHandler = (fn) => (req, res, next) =>
//   Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
