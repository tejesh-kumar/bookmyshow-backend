import redisClient from '../config/redis';
import { getHmac256Hash } from '../utils/cryptoHelpers';

class RefreshTokenRepository {
  async save(userId: string, token: string, expiryInSeconds: number) {
    const tokenHash = getHmac256Hash(token);

    return redisClient.set(`auth:refresh:${tokenHash}`, userId, {
      EX: expiryInSeconds,
    });
  }

  async findUserId(token: string) {
    const tokenHash = getHmac256Hash(token);
    return redisClient.get(`auth:refresh:${tokenHash}`);
  }

  async delete(token: string) {
    const tokenHash = getHmac256Hash(token);
    return redisClient.del(`auth:refresh:${tokenHash}`);
  }
}

export default RefreshTokenRepository;
