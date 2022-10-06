import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';
import { ProductInstance } from './Products';

export type HistoricPriceInstance = {
  id: string;
  product: ProductInstance;
  productId: string;
  value: number;
  createdAt?: Date;
  updatedAt?: Date;
};

const HistoricPrice = sequelize.define(
  'HistoricPrice',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    value: Sequelize.DOUBLE,
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
    tableName: 'historic_prices',
  }
);

HistoricPrice.associate = (models) => {
  HistoricPrice.belongsTo(models.Products, {
    foreignKey: 'productId',
    as: 'product',
  });
};

export default HistoricPrice;
