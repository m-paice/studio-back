import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';
import { CategoryInstance } from './Categories';

export type ProductInstance = {
  id: string;
  category: CategoryInstance;
  categoryId: string;
  name: string;
  price: number;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;

  addService: (model, options?) => Promise<void>;
  removeService: (model, options?) => Promise<void>;
};

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    price: Sequelize.DOUBLE,
    amount: Sequelize.INTEGER,
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'products',
  }
);

Product.associate = (models) => {
  Product.belongsTo(models.Categories, {
    foreignKey: 'categoryId',
    as: 'category',
  });

  Product.belongsToMany(models.Services, {
    foreignKey: 'productId',
    through: 'product_service',
    as: 'services',
  });
};

export default Product;
