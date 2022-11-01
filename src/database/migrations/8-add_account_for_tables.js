'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('categories', 'accountId', {
      type: Sequelize.UUID,
      references: {
        model: 'accounts',
        key: 'id',
      },
    });

    await queryInterface.addColumn('users', 'accountId', {
      type: Sequelize.UUID,
      references: {
        model: 'accounts',
        key: 'id',
      },
    });

    await queryInterface.addColumn('services', 'accountId', {
      type: Sequelize.UUID,
      references: {
        model: 'accounts',
        key: 'id',
      },
    });

    await queryInterface.addColumn('schedules', 'accountId', {
      type: Sequelize.UUID,
      references: {
        model: 'accounts',
        key: 'id',
      },
    });

    await queryInterface.addColumn('products', 'accountId', {
      type: Sequelize.UUID,
      references: {
        model: 'accounts',
        key: 'id',
      },
    });

    await queryInterface.addColumn('reports', 'accountId', {
      type: Sequelize.UUID,
      references: {
        model: 'accounts',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('categories', 'accountId');
    await queryInterface.removeColumn('users', 'accountId');
    await queryInterface.removeColumn('services', 'accountId');
    await queryInterface.removeColumn('schedules', 'accountId');
    await queryInterface.removeColumn('products', 'accountId');
    await queryInterface.removeColumn('reports', 'accountId');
  },
};
