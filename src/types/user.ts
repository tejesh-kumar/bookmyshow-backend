import { z } from 'zod';

import {
  UserSchema,
  userResponseSchema,
  createUserSchema,
  updateUserSchema,
  loginSchema,
} from '../models/user-model';

export type User = z.infer<typeof UserSchema>;

export type UserResponse = z.infer<typeof userResponseSchema>;

export type CreateUser = z.infer<typeof createUserSchema>;

export type UpdateUser = z.infer<typeof updateUserSchema>;

export type Login = z.infer<typeof loginSchema>;
