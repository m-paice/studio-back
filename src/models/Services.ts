import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';
import { ProductInstance } from './Products';

export type ServiceInstance = {
  id: string;
  name: string;
  type: string;
  price: number;
  porcent: number;
  createdAt?: Date;
  updatedAt?: Date;

  products: ProductInstance[];

  addProduct: (model, options?) => Promise<void>;
  removeProduct: (model, options?) => Promise<void>;
  removeProducts: (options?) => Promise<void>;
};

const Service = sequelize.define(
  'Service',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    price: Sequelize.DOUBLE,
    type: Sequelize.STRING,
    porcent: Sequelize.DOUBLE,
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
    tableName: 'services',
  }
);

Service.associate = (models) => {
  Service.hasMany(models.Schedules, {
    foreignKey: 'serviceId',
    as: 'schedules',
  });

  Service.belongsToMany(models.Products, {
    foreignKey: 'serviceId',
    through: models.ProductService,
    as: 'products',
  });
};

export default Service;
