import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';

export type AccountInstance = {
  id: string;
  name: string;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const Account = sequelize.define(
  'Account',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    type: Sequelize.STRING,
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
    tableName: 'accounts',
    paranoid: true,
  }
);

Account.associate = (models) => {};

export default Account;
