import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';
import { ScheduleInstance } from './Schedules';

export type ReportInstance = {
  id: string;
  scheduleId: string;
  schedule: ScheduleInstance;
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
  Report.belongsTo(models.Schedules, {
    foreignKey: 'scheduleId',
    as: 'schedule',
  });
};

export default Report;
