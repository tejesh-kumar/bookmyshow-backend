import crypto from 'node:crypto';

export const getHmac256Hash = (token: string): string => {
  return crypto
    .createHmac('sha256', process.env.REFRESH_TOKEN_SECRET!)
    .update(token)
    .digest('hex');
};

export const crypto64RandomString = () =>
  crypto.randomBytes(64).toString('hex');

export const crypto32RandomString = () =>
  crypto.randomBytes(32).toString('hex');
