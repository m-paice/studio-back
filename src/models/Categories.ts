import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';

export type CategoryInstance = {
  id: string;
  accountId: string;
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
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'categories',
    paranoid: true,
  }
);

Category.associate = (models) => {
  Category.belongsTo(models.Accounts, {
    foreignKey: 'accountId',
    as: 'account',
  });
};

export default Category;
