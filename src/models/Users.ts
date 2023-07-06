import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';

export type UserInstance = {
  id: string;
  accountId: string;
  name: string;
  type: string;
  cellPhone: string;
  password: string;
  isSuperAdmin: boolean;
  birthDate: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const User = sequelize.define(
  'User',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    type: Sequelize.STRING,
    cellPhone: Sequelize.STRING,
    password: Sequelize.STRING,
    isSuperAdmin: Sequelize.BOOLEAN,
    birthDate: Sequelize.STRING,
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
    tableName: 'users',
  }
);

User.associate = (models) => {
  User.belongsTo(models.Accounts, {
    foreignKey: 'accountId',
    as: 'account',
  });
};

export default User;
