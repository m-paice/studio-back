import HistoricPrice, { HistoricPriceInstance } from '../models/HistoricPrices';
import BaseRepository from './BaseRepository';

class HistoricPriceRepository extends BaseRepository<HistoricPriceInstance> {
  constructor() {
    super(HistoricPrice);
  }
}

export default new HistoricPriceRepository();
