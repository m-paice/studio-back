import Sequelize from 'sequelize';

import sequelize from '../../../services/sequelize';

import Account from '../../accounts/model/schema';
import Campaign from '../../../models/Campaigns';
import CampaignUser from '../../../models/CampaignUser';
import Schedules from '../../../models/Schedules';

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
  { tableName: 'users', paranoid: true },
);

User.belongsTo(Account, {
  foreignKey: 'accountId',
  as: 'account',
});

User.belongsToMany(Campaign, {
  foreignKey: 'userId',
  through: CampaignUser,
  as: 'campaign',
});

User.hasMany(Schedules, {
  foreignKey: 'userId',
  as: 'schedules',
});

export default User;
