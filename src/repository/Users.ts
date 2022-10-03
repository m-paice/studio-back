import User, { UserInstance } from '../models/Users';
import BaseRepository from './BaseRepository';

class UserRepository extends BaseRepository<UserInstance> {
  constructor() {
    super(User);
  }
}

export default new UserRepository();
