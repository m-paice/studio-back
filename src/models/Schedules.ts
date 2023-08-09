import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';
import { ServiceInstance } from './Services';
import { UserInstance } from './Users';

export type ScheduleInstance = {
  id: string;
  accountId: string;
  user: UserInstance;
  userId: string;
  services: ServiceInstance[] | string[];
  employee: UserInstance;
  employeeId: string;
  scheduleAt: Date;
  status: 'pending' | 'finished' | 'canceled';
  discount: number;
  addition: number;
  isPackage: boolean;
  createdAt?: Date;
  updatedAt?: Date;

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
    status: {
      type: Sequelize.STRING,
      defaultValue: 'pending',
    },
    discount: Sequelize.DOUBLE,
    addition: Sequelize.DOUBLE,
    isPackage: Sequelize.BOOLEAN,
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
