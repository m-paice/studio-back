import sequelize, { Op } from 'sequelize';

import ServiceRepository from '../repository/Services';
import { ServiceInstance } from '../models/Services';

import BaseResource from './BaseResource';

export class ServiceResource extends BaseResource<ServiceInstance> {
  constructor() {
    super({
      repository: ServiceRepository,
      entity: 'Service',
    });
  }

  async findServiceByName(name, query) {
    const nameLower = sequelize.where(sequelize.fn('lower', sequelize.col('name')), {
      [Op.like]: `%${name}%`,
    });

    return ServiceRepository.findMany({
      where: {
        nameLower,
        ...query.where,
      },
    });
  }
}

export default new ServiceResource();
