import sequelize, { Op } from 'sequelize';
import ProductRepository from '../repository/Products';
import { ProductInstance } from '../models/Products';
import BaseResource from './BaseResource';

export class ProductResource extends BaseResource<ProductInstance> {
  constructor() {
    super(ProductRepository, 'products');
  }

  async findProductByName(name, query) {
    const nameLower = sequelize.where(
      sequelize.fn('lower', sequelize.col('name')),
      {
        [Op.like]: `%${name}%`,
      }
    );

    return ProductRepository.findMany({
      where: {
        nameLower,
        ...query.where,
      },
    });
  }
}

export default new ProductResource();
