import Accounts, { AccountInstance } from '../models/Accounts';
import BaseRepository from './BaseRepository';

class AccountsRepository extends BaseRepository<AccountInstance> {
  constructor() {
    super(Accounts);
  }
}

export default new AccountsRepository();
