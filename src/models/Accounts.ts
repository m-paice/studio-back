import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';

export type AccountInstance = {
  id: string;
  name: string;
  type: string;
  trial: boolean;
  enable: boolean;
  dueDate: Date | null;
  isAutoCampaign: boolean;
  config: {
    startAt: number;
    endAt: number;
    days: {
      dom: boolean;
      seg: boolean;
      ter: boolean;
      qua: boolean;
      qui: boolean;
      sex: boolean;
      sab: boolean;
    };
  };
  token: string[];
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
    isAutoCampaign: Sequelize.BOOLEAN,
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    trial: Sequelize.BOOLEAN,
    // credit: Sequelize.INTEGER,
    enable: Sequelize.BOOLEAN,
    dueDate: Sequelize.DATE,
    config: Sequelize.JSONB,
    token: Sequelize.JSONB,
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
