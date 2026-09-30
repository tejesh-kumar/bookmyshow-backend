import { RowDataPacket } from 'mysql2';
import db from '../db/mysql';
import { User } from '../types/user';
import BaseRepository from './baseRepository';

type UserRow = User & RowDataPacket;

class UserRepository extends BaseRepository<User> {
  constructor() {
    super(db, 'users');
  }

  async findByEmailOrPhone(identifier: string): Promise<User | null> {
    const sql = `SELECT * FROM users WHERE email = ? OR phoneNumber = ? LIMIT 1`;
    const [rows] = await this.db.execute<UserRow[]>(sql, [
      identifier,
      identifier,
    ]);
    return rows[0] ?? null;
  }
}

export default UserRepository;
