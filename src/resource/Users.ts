import sequelize, { Op } from 'sequelize';
import UserRepository from '../repository/Users';
import { UserInstance } from '../models/Users';
import BaseResource from './BaseResource';

export class UserResource extends BaseResource<UserInstance> {
  constructor() {
    super({
      repository: UserRepository,
      entity: 'User',
    });
  }

  async findUserByName(name, query) {
    const nameLower = sequelize.where(
      sequelize.fn('lower', sequelize.col('name')),
      {
        [Op.like]: `%${name}%`,
      },
    );

    return UserRepository.findMany({
      where: {
        nameLower,
        ...query.where,
      },
    });
  }

  async findUserEmployeeByName(name, query) {
    return UserRepository.findMany({
      where: {
        [Op.and]: [
          { type: 'pj' },
          sequelize.where(sequelize.fn('lower', sequelize.col('name')), {
            [Op.like]: `%${name}%`,
          }),
        ],
        ...query.where,
      },
    });
  }
}

export default new UserResource();
