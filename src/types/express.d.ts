import { z } from 'zod';

declare global {
  namespace Express {
    interface Request {
      validated: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

export {};

// todo: declare request interface per request
