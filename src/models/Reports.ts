import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';

import { ScheduleInstance } from './Schedules';

export type ReportInstance = {
  id: string;
  accountId: string;
  scheduleId: string;
  schedule: ScheduleInstance;
  entry: number;
  out: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const Report = sequelize.define(
  'Report',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    entry: Sequelize.DOUBLE,
    out: Sequelize.DOUBLE,
    description: Sequelize.STRING,
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
    tableName: 'reports',
    paranoid: true,
  },
);

Report.associate = (models) => {
  Report.belongsTo(models.Accounts, {
    foreignKey: 'accountId',
    as: 'account',
  });
  Report.belongsTo(models.Schedules, {
    foreignKey: 'scheduleId',
    as: 'schedule',
  });
};

export default Report;
