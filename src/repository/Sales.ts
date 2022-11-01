import Sales, { SalesInstance } from '../models/Sales';
import BaseRepository from './BaseRepository';

class SalesRepository extends BaseRepository<SalesInstance> {
  constructor() {
    super(Sales);
  }
}

export default new SalesRepository();
