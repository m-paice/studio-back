import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';
import { ServiceScheduleInstance } from './ServiceSchedule';
import { ScheduleInstance } from './Schedules';

export type ServiceInstance = {
  id: string;
  accountId: string;
  name: string;
  type: string;
  price: number;
  porcent: number;
  image: string;
  averageTime: string;
  createdAt?: Date;
  updatedAt?: Date;

  ServiceSchedule: ServiceScheduleInstance;
  schedules: ScheduleInstance;
};

const Service = sequelize.define(
  'Service',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    price: Sequelize.DOUBLE,
    type: Sequelize.STRING,
    image: Sequelize.TEXT,
    porcent: Sequelize.DOUBLE,
    averageTime: Sequelize.STRING,
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
    tableName: 'services',
    paranoid: true,
  },
);

Service.associate = (models) => {
  Service.belongsTo(models.Accounts, {
    foreignKey: 'accountId',
    as: 'account',
  });
  Service.belongsToMany(models.Schedules, {
    foreignKey: 'serviceId',
    through: models.ServiceSchedule,
    as: 'schedules',
  });
};

export default Service;
