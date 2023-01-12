import sequelize, { Op } from 'sequelize';
import ProductRepository from '../repository/Products';
import { ProductInstance } from '../models/Products';
import BaseResource from './BaseResource';
import HistoricPrice from './HistoricPrices';
import queuedAsyncMap from '../utils/queuedAsyncMap';

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

  async destroyById(id: string, options?: sequelize.Options): Promise<any> {
    const historicPricesOfProductId =
      await HistoricPrice.historicPricesOfProductId(id);

    await queuedAsyncMap(historicPricesOfProductId, async (item) => {
      return HistoricPrice.destroyById(item.id);
    });

    const product = await this.findById(id);

    return this.destroy(product);
  }
}

export default new ProductResource();
