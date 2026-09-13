import db from '../db/mysql';
import { User } from '../types/user';
import BaseRepository from './baseRepository';

class UserRepository extends BaseRepository<User> {
  constructor() {
    super(db, 'users');
  }
}

export default UserRepository;
