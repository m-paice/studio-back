import debug from 'debug';

import sequelize from './sequelize';
import models from '../models';

const logger = debug('@sequelize');

let associated = false;

export const initAssociations = () => {
  if (!associated) {
    Object.values(models).forEach((model) => {
      if (model.associate) model.associate(models);
    });
    associated = true;
  }
};

export const start = () => {
  sequelize
    .sync({
      hooks: true,
    })
    .then(() => {
      initAssociations();
      logger('db is ready');
    })
    .catch((error) => {
      logger('db is error', {
        message: error,
      });
    });
};

export const destroy = () => sequelize.close();

export default start;
