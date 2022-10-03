import sequelize, { Op } from 'sequelize';
import UserRepository from '../repository/Users';
import { UserInstance } from '../models/Users';
import BaseResource from './BaseResource';

export class UserResource extends BaseResource<UserInstance> {
  constructor() {
    super(UserRepository);
  }

  async findUserByName(name) {
    return UserRepository.findMany({
      where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), {
        [Op.like]: `%${name}%`,
      }),
    });
  }

  async findUserEmployeeByName(name) {
    return UserRepository.findMany({
      where: {
        [Op.and]: [
          { type: 'pj' },
          sequelize.where(sequelize.fn('lower', sequelize.col('name')), {
            [Op.like]: `%${name}%`,
          }),
        ],
      },
    });
  }
}

export default new UserResource();
