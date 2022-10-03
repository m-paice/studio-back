import sequelize, { Op } from 'sequelize';
import ProductRepository from '../repository/Products';
import { ProductInstance } from '../models/Products';
import BaseResource from './BaseResource';

export class ProductResource extends BaseResource<ProductInstance> {
  constructor() {
    super(ProductRepository);
  }

  async findProductByName(name) {
    return ProductRepository.findMany({
      where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), {
        [Op.like]: `%${name}%`,
      }),
    });
  }
}

export default new ProductResource();
