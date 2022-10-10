import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';

export type ProductServiceInstance = {
  productId: string;
  serviceId: string;
  createdAt: Date;
  updatedAt: Date;
};

const ProductService = sequelize.define(
  'ProductService',
  {
    productId: Sequelize.UUID,
    serviceId: Sequelize.UUID,
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
  },
  {
    tableName: 'product_service',
  }
);

ProductService.associate = (models) => {};

export default ProductService;
