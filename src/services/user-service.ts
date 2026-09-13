import UserRepository from '../repositories/user-repository';
import { CreateUser } from '../types/user';
import { hashPassword } from '../utils/passwordHashHelpers';

const userRepository = new UserRepository();

async function createUser(userData: CreateUser) {
  const user = {
    ...userData,
    password: await hashPassword(userData?.password),
  };
  const userId = await userRepository.create(user);
  return { userId };
}

export default { createUser };
