import sequelize, { Op } from 'sequelize';

import CategoriesRepository from '../repository/Categories';
import { CategoryInstance } from '../models/Categories';
import BaseResource from './BaseResource';
import queuedAsyncMap from '../utils/queuedAsyncMap';
import ProductResource from './Products';

interface Data extends Partial<CategoryInstance> {
  products: string[];
}

export class CategoriesResource extends BaseResource<CategoryInstance> {
  constructor() {
    super(CategoriesRepository);
  }

  async findCategoryByName(name, query) {
    const nameLower = sequelize.where(
      sequelize.fn('lower', sequelize.col('name')),
      {
        [Op.like]: `%${name}%`,
      }
    );

    return CategoriesRepository.findMany({
      where: {
        nameLower,
        ...query.where,
      },
    });
  }

  async create(data: Data) {
    const categotyCreated = await CategoriesRepository.create(data);

    if (Array.isArray(data.products) && data.products.length) {
      await queuedAsyncMap(data.products, async (item) => {
        await ProductResource.updateById(item, {
          categoryId: categotyCreated.id,
        });
      });
    }

    return categotyCreated;
  }
}

export default new CategoriesResource();
