import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';
import { CategoryInstance } from './Categories';

export type ProductInstance = {
  id: string;
  name: string;
  category: CategoryInstance;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
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
};

export default Product;
