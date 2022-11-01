import ProductSale, { ProductSaleInstance } from '../models/ProductSale';
import BaseRepository from './BaseRepository';

class ProductSaleRepository extends BaseRepository<ProductSaleInstance> {
  constructor() {
    super(ProductSale);
  }
}

export default new ProductSaleRepository();
