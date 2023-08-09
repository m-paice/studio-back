import sequelize, { Op } from 'sequelize';

import AccountsRepository from '../repository/Accounts';
import { AccountInstance } from '../models/Accounts';
import BaseResource from './BaseResource';

export class AccountsResource extends BaseResource<AccountInstance> {
  constructor() {
    super({
      repository: AccountsRepository,
      entity: 'Accounts',
    });
  }

  async findAccountByName(name, query) {
    const nameLower = sequelize.where(
      sequelize.fn('lower', sequelize.col('name')),
      {
        [Op.like]: `%${name}%`,
      }
    );

    return AccountsRepository.findMany({
      where: {
        nameLower,
        ...query.where,
      },
    });
  }
}

export default new AccountsResource();
