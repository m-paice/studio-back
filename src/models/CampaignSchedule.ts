import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';

export type CampaignScheduleInstance = {
  campaignId: string;
  scheduleId: string;
  createdAt: Date;
  updatedAt: Date;
};

const CampaignSchedule = sequelize.define(
  'CampaignSchedule',
  {
    campaignId: Sequelize.UUID,
    scheduleId: Sequelize.UUID,
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
    deletedAt: {
      type: Sequelize.DATE,
    },
  },
  {
    tableName: 'campaign_schedule',
    paranoid: true,
  },
);

CampaignSchedule.associate = () => {};

export default CampaignSchedule;
