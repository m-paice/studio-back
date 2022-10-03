import HistoricPriceRepository from '../repository/HistoricPrices';
import { HistoricPriceInstance } from '../models/HistoricPrices';
import BaseResource from './BaseResource';

export class HistoricPriceResource extends BaseResource<HistoricPriceInstance> {
  constructor() {
    super(HistoricPriceRepository);
  }
}

export default new HistoricPriceResource();
