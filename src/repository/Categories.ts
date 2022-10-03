import Categories, { CategoryInstance } from '../models/Categories';
import BaseRepository from './BaseRepository';

class CategoriesRepository extends BaseRepository<CategoryInstance> {
  constructor() {
    super(Categories);
  }
}

export default new CategoriesRepository();
