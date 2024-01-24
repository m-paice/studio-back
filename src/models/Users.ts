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
  theme: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
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
    cellPhone: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: Sequelize.STRING,
    isSuperAdmin: Sequelize.BOOLEAN,
    birthDate: Sequelize.STRING,
    theme: Sequelize.STRING,
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
    },
  },
  {
    tableName: 'users',
    paranoid: true,
  },
);

User.associate = (models) => {
  User.belongsTo(models.Accounts, {
    foreignKey: 'accountId',
    as: 'account',
  });
  User.belongsToMany(models.Campaigns, {
    foreignKey: 'userId',
    through: models.CampaignUser,
    as: 'campaign',
  });
  User.hasMany(models.Schedules, {
    foreignKey: 'userId',
    as: 'schedules'
  })
};

export default User;
