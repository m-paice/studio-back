import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';
import { ServiceInstance } from './Services';
import { UserInstance } from './Users';
import { ServiceScheduleInstance } from './ServiceSchedule';

export type ScheduleInstance = {
  id: string;
  accountId: string;
  user: UserInstance;
  userId: string;
  services: ServiceInstance[] | string[];
  employee: UserInstance;
  employeeId: string;
  scheduleAt: Date;
  shortName: string;
  status: 'pending' | 'finished' | 'canceled';
  discount: number;
  averageTime: number;
  addition: number;
  createdAt?: Date;
  updatedAt?: Date;

  ServiceSchedule: ServiceScheduleInstance;

  addService(data: ServiceInstance, options?): void;
  removeService(data: ServiceInstance, options?): void;
};

const Schedule = sequelize.define(
  'Schedule',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    scheduleAt: Sequelize.DATE,
    shortName: Sequelize.STRING,
    status: {
      type: Sequelize.STRING,
      defaultValue: 'pending',
    },
    averageTime: Sequelize.INTEGER,
    discount: Sequelize.DOUBLE,
    addition: Sequelize.DOUBLE,
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
    tableName: 'schedules',
    paranoid: true,
  },
);

Schedule.associate = (models) => {
  Schedule.belongsTo(models.Accounts, {
    foreignKey: 'accountId',
    as: 'account',
  });
  Schedule.belongsTo(models.Users, {
    foreignKey: 'userId',
    as: 'user',
  });

  Schedule.belongsToMany(models.Services, {
    foreignKey: 'scheduleId',
    through: models.ServiceSchedule,
    as: 'services',
  });

  Schedule.belongsTo(models.Users, {
    foreignKey: 'employeeId',
    as: 'employee',
  });
};

export default Schedule;
