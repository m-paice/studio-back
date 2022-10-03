import sequelize, { Op } from 'sequelize';
import ServiceRepository from '../repository/Services';
import { ServiceInstance } from '../models/Services';
import BaseResource from './BaseResource';

export class ServiceResource extends BaseResource<ServiceInstance> {
  constructor() {
    super(ServiceRepository);
  }

  async findServiceByName(name) {
    return ServiceRepository.findMany({
      where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), {
        [Op.like]: `%${name}%`,
      }),
    });
  }
}

export default new ServiceResource();
