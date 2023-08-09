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
    super({
      repository: ServiceRepository,
      entity: 'Service',
    });
  }

  async findServiceByName(name, query) {
    const nameLower = sequelize.where(
      sequelize.fn('lower', sequelize.col('name')),
      {
        [Op.like]: `%${name}%`,
      },
    );

    return ServiceRepository.findMany({
      where: {
        nameLower,
        ...query.where,
      },
    });
  }

  async create(data: Data) {
    const serviceCreated = await ServiceRepository.create(data);

    if (Array.isArray(data.products) && data.products.length) {
      await queuedAsyncMap(data.products, async (item) => {
        const product = await Products.findById(item.id);

        await serviceCreated.addProduct(product);
      });
    }

    return serviceCreated;
  }

  async updateById(id: string, data: Data) {
    const serviceUpdated = await ServiceRepository.updateById(id, data);

    const allProducts = await ServiceRepository.findById(serviceUpdated.id, {
      include: ['products'],
    });

    await queuedAsyncMap(allProducts.products, async (item) => {
      const product = await Products.findById(item.id);
      await serviceUpdated.removeProduct(product);
    });

    if (Array.isArray(data.products) && data.products.length) {
      await queuedAsyncMap(data.products, async (item) => {
        const product = await Products.findById(item.id);
        await serviceUpdated.addProduct(product);
      });
    }

    return serviceUpdated;
  }
}

export default new ServiceResource();
