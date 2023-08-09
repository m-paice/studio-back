import Sequelize from 'sequelize';

import sequelize from '../services/sequelize';
import { AccountInstance } from './Accounts';
import { SalesInstance } from './Sales';

export type PaymentsInstance = {
  id: string;
  accountId: string;
  account: AccountInstance;
  saleId: string;
  sale: SalesInstance;
  formOfPayment: number;
  amountParcel: number;
  createdAt?: Date;
  updatedAt?: Date;
};

const Payments = sequelize.define(
  'Payments',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    formOfPayment: Sequelize.INTEGER,
    amountParcel: Sequelize.INTEGER,
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
    tableName: 'payments',
  },
);

Payments.associate = (models) => {
  Payments.belongsTo(models.Accounts, {
    foreignKey: 'accountId',
    as: 'account',
  });

  Payments.belongsTo(models.Sales, {
    foreignKey: 'saleId',
    as: 'sale',
  });
};

export default Payments;
