import { z } from 'zod';

declare global {
  namespace Express {
    interface Request {
      validated: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
      user: {
        id: string;
        role: string;
      };
    }
  }
}

export {};

// todo: declare request interface per request
