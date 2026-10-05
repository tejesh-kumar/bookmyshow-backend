import redisClient from '../config/redis';
import UserRepository from '../repositories/user-repository';
import { CreateUser, LoginProps, User } from '../types/user';
import { UnauthorizedError, ValidationError } from '../utils/errors/app-error';
import { verifyPassword, hashPassword } from '../utils/passwordHashHelpers';
import {
  getHmac256Hash,
  crypto64RandomString,
  crypto32RandomString,
} from '../utils/cryptoHelpers';
import { generateJwtToken } from '../utils/jwt';
import RefreshTokenRepository from '../repositories/refresh-token-repository';
import { EmailService } from '.';

const userRepository = new UserRepository();
const refreshTokenRepository = new RefreshTokenRepository();

async function createUser(userData: CreateUser) {
  const user = {
    ...userData,
    password: await hashPassword(userData?.password),
  };
  const userId = await userRepository.create(user);
  EmailService.send();
  return { userId };
}

async function validateAndRefreshAccessToken(refreshToken: string) {
  // check if same refresh token exists in redis
  const tokenHash = getHmac256Hash(refreshToken);
  const userId = await refreshTokenRepository.findUserId(tokenHash);

  if (!userId) {
    throw new UnauthorizedError('Refresh token is invalid');
  }

  const accessTokenPayload = { userId: userId, role: 'user' };
  const accessToken = generateJwtToken(accessTokenPayload);

  return accessToken;
}

async function findUser(loginData: LoginProps): Promise<User | null> {
  const { email, phoneNumber, password: inputPassword } = loginData;
  const emailOrPhone = email ?? phoneNumber;

  if (!emailOrPhone) {
    throw new ValidationError('Email or phone number is required');
  }

  const validUser = await userRepository.findByEmailOrPhone(emailOrPhone);

  if (!validUser || !validUser?.password) {
    return null;
  }

  const isPasswordMatching = await verifyPassword(
    inputPassword,
    validUser.password
  );

  if (!isPasswordMatching) {
    return null;
  }

  return validUser;
}

async function login(userData: LoginProps) {
  // if user is authorized
  const authorizedUser = await findUser(userData);

  if (!authorizedUser) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // generate jwt refresh token Expiry: 15 days
  const refreshToken = crypto64RandomString();
  const expiryInSeconds = 60 * 60 * 24 * 15;
  const csrfToken = crypto32RandomString(); // generate csrf token
  const { id } = authorizedUser;
  await refreshTokenRepository.save(String(id), refreshToken, expiryInSeconds); // save refresh token in redis

  const accessTokenPayload = { userId: id, role: 'user' };

  // generate jwt access token Ex: 10 minutes
  const accessToken = generateJwtToken(accessTokenPayload);

  // send both tokens in response with success msg of login successful
  return { refreshToken, accessToken, csrfToken };
}

async function logout(refreshToken: string) {
  const result = await refreshTokenRepository.delete(refreshToken);
  return result;
}

export default { createUser, login, logout, validateAndRefreshAccessToken };
