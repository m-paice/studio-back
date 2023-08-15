import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';

export type ServiceInstance = {
  id: string;
  accountId: string;
  name: string;
  type: string;
  price: number;
  porcent: number;
  createdAt?: Date;
  updatedAt?: Date;
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
    porcent: Sequelize.DOUBLE,
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
