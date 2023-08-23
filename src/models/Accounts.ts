import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';

export type AccountInstance = {
  id: string;
  name: string;
  type: string;
  trial: boolean;
  enable: boolean;
  dueDate: Date;
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
    trial: Sequelize.BOOLEAN,
    enable: Sequelize.BOOLEAN,
    dueDate: Sequelize.DATE,
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'accounts',
  },
);

Account.associate = () => {};

export default Account;
