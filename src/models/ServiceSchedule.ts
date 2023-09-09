import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';

export type ServiceScheduleInstance = {
  serviceId: string;
  scheduleId: string;
  isPackage: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const ServiceSchedule = sequelize.define(
  'ServiceSchedule',
  {
    serviceId: Sequelize.UUID,
    scheduleId: Sequelize.UUID,
    isPackage: Sequelize.BOOLEAN,
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
    deletedAt: {
      type: Sequelize.DATE,
    },
  },
  {
    tableName: 'service_schedule',
    paranoid: true,
  },
);

ServiceSchedule.associate = () => {};

export default ServiceSchedule;
