import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';

export type CategoryInstance = {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const Category = sequelize.define(
  'Category',
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
    tableName: 'categories',
  }
);

Category.associate = (models) => {};

export default Category;
