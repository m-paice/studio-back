import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';

export type BillingInstance = {
  id: string;
  ipAddress: string;
  method: string;
  originalUrl: string;
  userAgent: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const Billing = sequelize.define(
  'Billing',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    ipAddress: Sequelize.STRING,
    method: Sequelize.STRING,
    originalUrl: Sequelize.STRING,
    userAgent: Sequelize.STRING,
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'billings',
  },
);

Billing.associate = (models) => {
  Billing.belongsTo(models.Accounts, {
    foreignKey: 'accountId',
    as: 'account',
  });
  Billing.belongsTo(models.Users, {
    foreignKey: 'userId',
    as: 'user',
  });
};

export default Billing;
