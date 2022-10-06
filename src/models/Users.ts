import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';

export type UserInstance = {
  id: string;
  name: string;
  type: string;
  cellPhone: string;
  password: string;
  isSuperAdmin: string;
  birthDate: Date;
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
    birthDate: Sequelize.DATE,
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

User.associate = (models) => {};

export default User;
