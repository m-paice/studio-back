import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';
import { SalesInstance } from './Sales';
import { ScheduleInstance } from './Schedules';

export type ReportInstance = {
  id: string;
  accountId: string;
  scheduleId: string;
  schedule: ScheduleInstance;
  saleId: string;
  sale: SalesInstance;
  entry: number;
  out: number;
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
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'reports',
  }
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
  Report.belongsTo(models.Sales, {
    foreignKey: 'saleId',
    as: 'sale',
  });
};

export default Report;
