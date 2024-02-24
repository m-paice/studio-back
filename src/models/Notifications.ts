import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';

export type NotificationsInstance = {
  id: string;
  accountId: string;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

const Notifications = sequelize.define(
  'Notifications',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    title: Sequelize.STRING,
    content: Sequelize.STRING,
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
    tableName: 'notifications',
    paranoid: true,
  },
);

Notifications.associate = (models) => {
  Notifications.belongsTo(models.Accounts, {
    foreignKey: 'accountId',
    as: 'account',
  });
};

export default Notifications;
