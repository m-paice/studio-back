import Sequelize from 'sequelize';

import sequelize from '../../../services/sequelize';

import Accounts from '../../accounts/model/schema';
import Schedules from '../../schedules/model/schema';
import ServiceSchedule from '../../ServiceSchedule/model/schema';

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

Service.belongsTo(Accounts, {
  foreignKey: 'accountId',
  as: 'account',
});

Service.belongsToMany(Schedules, {
  foreignKey: 'serviceId',
  through: ServiceSchedule,
  as: 'schedules',
});

export default Service;
