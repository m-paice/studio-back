import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';

export type ProductSaleInstance = {
  productId: string;
  saleId: string;
  amount: number;
  discount: number;
  addition: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
};

const ProductSale = sequelize.define(
  'ProductSale',
  {
    productId: Sequelize.UUID,
    saleId: Sequelize.UUID,
    amount: Sequelize.INTEGER,
    discount: Sequelize.DOUBLE,
    addition: Sequelize.DOUBLE,
    subtotal: Sequelize.DOUBLE,
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
    tableName: 'product_sale',
  },
);

ProductSale.associate = () => {};

export default ProductSale;
