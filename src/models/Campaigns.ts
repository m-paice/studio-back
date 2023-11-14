import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';
import { UserInstance } from './Users';
import { ScheduleInstance } from './Schedules';

export type CampaignInstance = {
  id: string;
  accountId: string;
  templateId: string;
  name: string;
  status: 'pending' | 'processing' | 'done';
  content: string;
  createdAt?: Date;
  updatedAt?: Date;

  users: UserInstance[];
  schedules: ScheduleInstance[];

  addUser(data: UserInstance, options?): void;
  removeUser(data: UserInstance, options?): void;

  addSchedule(data: ScheduleInstance, options?): void;
  removeSchedule(data: ScheduleInstance, options?): void;
};

const Campaign = sequelize.define(
  'Campaign',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    status: Sequelize.STRING,
    content: Sequelize.TEXT,
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
    tableName: 'campaigns',
    paranoid: true,
  },
);

Campaign.associate = (models) => {
  Campaign.belongsTo(models.Accounts, {
    foreignKey: 'accountId',
    as: 'account',
  });
  Campaign.belongsTo(models.Templates, {
    foreignKey: 'templateId',
    as: 'template',
  });
  Campaign.belongsToMany(models.Users, {
    foreignKey: 'campaignId',
    through: models.CampaignUser,
    as: 'users',
  });
  Campaign.belongsToMany(models.Schedules, {
    foreignKey: 'campaignId',
    through: models.CampaignSchedule,
    as: 'schedules',
  });
};

export default Campaign;
