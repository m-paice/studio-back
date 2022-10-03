import sequelize from './sequelize';
import models from '../models';

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
  initAssociations();
  return models;
};

export const destroy = () => sequelize.close();

export default start;
