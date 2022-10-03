import Product, { ProductInstance } from '../models/Products';
import BaseRepository from './BaseRepository';

class ProductRepository extends BaseRepository<ProductInstance> {
  constructor() {
    super(Product);
  }
}

export default new ProductRepository();
