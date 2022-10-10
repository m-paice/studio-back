import ProductService, {
  ProductServiceInstance,
} from '../models/ProductService';
import BaseRepository from './BaseRepository';

class ProductServiceRepository extends BaseRepository<ProductServiceInstance> {
  constructor() {
    super(ProductService);
  }
}

export default new ProductServiceRepository();
