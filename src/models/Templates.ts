import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';

export type TemplateInstance = {
  id: string;
  accountId: string;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

const Template = sequelize.define(
  'Template',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    title: Sequelize.STRING,
    content: Sequelize.TEXT,
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
    tableName: 'templates',
    paranoid: true,
  },
);

Template.associate = (models) => {
  Template.belongsTo(models.Accounts, {
    foreignKey: 'accountId',
    as: 'account',
  });
};

export default Template;
