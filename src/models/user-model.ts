import { z } from 'zod';
import { dateTimeSchema } from './shared';

const emailSchema = z.email().trim().toLowerCase();

const phoneNumberSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{7,14}$/, 'Invalid phone number');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters');

const userStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']);

const UserSchema = z.object({
  id: z.number().int().positive(),
  email: emailSchema,
  phoneNumber: phoneNumberSchema,
  password: passwordSchema,
  authProvider: z.enum(['EMAIL', 'PHONE']),
  status: userStatusSchema,
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema,
});

const createUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const userResponseSchema = UserSchema.omit({ password: true });

const loginSchema = z.discriminatedUnion('authProvider', [
  z.object({
    authProvider: z.literal('EMAIL'),
    email: emailSchema,
    password: passwordSchema,
  }),

  z.object({
    authProvider: z.literal('PHONE'),
    phoneNumber: phoneNumberSchema,
    password: passwordSchema,
  }),
]);

const updateUserSchema = z.object({
  status: userStatusSchema,
});

const changePasswordSchema = z.object({
  password: passwordSchema,
});

export {
  UserSchema,
  createUserSchema,
  updateUserSchema,
  userResponseSchema,
  loginSchema,
  changePasswordSchema,
};
