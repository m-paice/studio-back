import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';
import { ServiceInstance } from './Services';
import { UserInstance } from './Users';

export type ScheduleInstance = {
  id: string;
  accountId: string;
  user: UserInstance;
  userId: string;
  service: ServiceInstance;
  serviceId: string;
  employee: UserInstance;
  employeeId: string;
  scheduleAt: Date;
  status: 'pending' | 'finished' | 'canceled';
  sent: boolean;
  discount: number;
  addition: number;
  isPackage: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
    status: {
      type: Sequelize.STRING,
      defaultValue: 'pending',
    },
    discount: Sequelize.DOUBLE,
    addition: Sequelize.DOUBLE,
    isPackage: Sequelize.BOOLEAN,
    sent: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
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
    tableName: 'schedules',
  }
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

  Schedule.belongsTo(models.Services, {
    foreignKey: 'serviceId',
    as: 'service',
  });

  Schedule.belongsTo(models.Users, {
    foreignKey: 'employeeId',
    as: 'employee',
  });
};

export default Schedule;
