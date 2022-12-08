import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';
import { ProductInstance } from './Products';
import { UserInstance } from './Users';

export type SalesInstance = {
  id: string;
  accountId: string;
  products: ProductInstance[];
  userId: string;
  user: UserInstance;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;

  addProduct(data: ProductInstance, options?): void;
  removeProduct(data: ProductInstance, options?): void;
};

const Sales = sequelize.define(
  'Sales',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    total: Sequelize.DOUBLE,
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
    tableName: 'sales',
  }
);

Sales.associate = (models) => {
  Sales.belongsTo(models.Accounts, {
    foreignKey: 'accountId',
    as: 'account',
  });

  Sales.belongsTo(models.Users, {
    foreignKey: 'userId',
    as: 'user',
  });

  Sales.hasOne(models.Payments, {
    foreignKey: 'saleId',
    as: 'payment',
  });

  Sales.belongsToMany(models.Products, {
    foreignKey: 'saleId',
    through: models.ProductSale,
    as: 'products',
  });
};

export default Sales;
