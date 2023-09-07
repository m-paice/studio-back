import sequelize, { Op } from 'sequelize';
import UserRepository from '../repository/Users';
import { UserInstance } from '../models/Users';
import BaseResource from './BaseResource';
import AuthResource from './Auth';
import queuedAsyncMap from '../utils/queuedAsyncMap';

export class UserResource extends BaseResource<UserInstance> {
  constructor() {
    super({
      repository: UserRepository,
      entity: 'User',
      onCreated: async ({ id, new: newRecord }) => {
        const { password } = newRecord as unknown as UserInstance;

        if (password) {
          const hash = await AuthResource.generateHash(password);

          await UserRepository.updateById(id, { password: hash });
        }
      },
      onUpdated: async ({ id, body }) => {
        const payload = body as unknown as UserInstance;

        if (payload.password) {
          const hash = await AuthResource.generateHash(payload.password);

          await UserRepository.updateById(id, { password: hash });
        }
      },
    });
  }

  async import({ payload, accountId }: { payload: { name: string; phone: string }[]; accountId: string }) {
    await queuedAsyncMap(payload, async (user) => {
      const cellPhone = (user.phone.match(/\d+/g) || []).join('');

      const userExist = await UserRepository.findOne({ where: { accountId, name: user.name, cellPhone } });

      if (!userExist) {
        await UserRepository.create({
          accountId,
          name: user.name,
          cellPhone,
          type: 'pf',
        });
      }
    });
  }

  async findUserByName(name, query) {
    const nameLower = sequelize.where(sequelize.fn('lower', sequelize.col('name')), {
      [Op.like]: `%${name}%`,
    });

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
