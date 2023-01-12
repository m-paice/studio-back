import HistoricPriceRepository from '../repository/HistoricPrices';
import { HistoricPriceInstance } from '../models/HistoricPrices';
import BaseResource from './BaseResource';

export class HistoricPriceResource extends BaseResource<HistoricPriceInstance> {
  constructor() {
    super(HistoricPriceRepository);
  }

  async historicPricesOfProductId(productId) {
    return this.findMany({
      where: {
        productId,
      },
    });
  }
}

export default new HistoricPriceResource();
