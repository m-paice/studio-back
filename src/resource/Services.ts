import sequelize, { Op } from 'sequelize';

import ServiceRepository from '../repository/Services';
import { ServiceInstance } from '../models/Services';
import { ProductInstance } from '../models/Products';
import BaseResource from './BaseResource';
import queuedAsyncMap from '../utils/queuedAsyncMap';
import Products from './Products';

interface Data extends Partial<ServiceInstance> {
  products: ProductInstance[];
}

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

  async create(data: Data) {
    const serviceCreated = await ServiceRepository.create(data);

    if (Array.isArray(data.products) && data.products.length) {
      await queuedAsyncMap(data.products, async (item) => {
        const product = await Products.findById(item.id);

        serviceCreated.addProduct(product);
      });
    }

    return serviceCreated;
  }
}

export default new ServiceResource();
