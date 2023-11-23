import sequelize, { Op } from 'sequelize';
import { addDays } from 'date-fns';

import AccountsRepository from '../repository/Accounts';
import { AccountInstance } from '../models/Accounts';
import BaseResource from './BaseResource';
import { DUE_DATE_TRIAL } from '../constants';

export class AccountsResource extends BaseResource<AccountInstance> {
  constructor() {
    super({
      repository: AccountsRepository,
      entity: 'Accounts',
    });
  }

  async findAccountByName(name, query) {
    const nameLower = sequelize.where(sequelize.fn('lower', sequelize.col('name')), {
      [Op.like]: `%${name}%`,
    });

    return AccountsRepository.findMany({
      where: {
        nameLower,
        ...query.where,
      },
    });
  }

  async createTrial({ name }: { name: string }) {
    const dueDate = addDays(new Date(), DUE_DATE_TRIAL);

    const payload = {
      name,
      trial: true,
      enable: true,
      dueDate,
      type: 'schedules',
    };

    const account = await AccountsRepository.create(payload);

    return account;
  }
}

export default new AccountsResource();
