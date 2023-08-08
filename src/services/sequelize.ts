import { Sequelize } from 'sequelize';

import { NODE_ENV } from '../constants';

const configDb = require('../config/database');

const config = configDb[NODE_ENV];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    dialect: config.dialect,
    host: config.host,
    port: config.port,
    logging: false,
  }
);

export default sequelize;
