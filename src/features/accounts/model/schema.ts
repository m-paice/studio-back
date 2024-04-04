import Sequelize from 'sequelize';

import sequelize from '../../../services/sequelize';

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
    isAutoCampaign: Sequelize.BOOLEAN,
    trial: Sequelize.BOOLEAN,
    enable: Sequelize.BOOLEAN,
    dueDate: Sequelize.DATE,
    config: Sequelize.JSONB,
    token: Sequelize.JSONB,
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  { tableName: 'accounts' },
);

export default Account;
