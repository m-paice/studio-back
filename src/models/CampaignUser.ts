import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';

export type CampaignUserInstance = {
  campaignId: string;
  userId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

const CampaignUser = sequelize.define(
  'CampaignUser',
  {
    campaignId: Sequelize.UUID,
    userId: Sequelize.UUID,
    status: Sequelize.STRING,
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
    tableName: 'campaign_user',
    paranoid: true,
  },
);

CampaignUser.associate = () => {};

export default CampaignUser;
