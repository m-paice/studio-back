'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('accounts', 'deletedAt', {
      type: Sequelize.DATE,
    });

    await queryInterface.addColumn('categories', 'deletedAt', {
      type: Sequelize.DATE,
    });

    await queryInterface.addColumn('users', 'deletedAt', {
      type: Sequelize.DATE,
    });

    await queryInterface.addColumn('services', 'deletedAt', {
      type: Sequelize.DATE,
    });

    await queryInterface.addColumn('schedules', 'deletedAt', {
      type: Sequelize.DATE,
    });

    await queryInterface.addColumn('products', 'deletedAt', {
      type: Sequelize.DATE,
    });

    await queryInterface.addColumn('reports', 'deletedAt', {
      type: Sequelize.DATE,
    });

    await queryInterface.addColumn('sales', 'deletedAt', {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('accounts', 'deletedAt');
    await queryInterface.removeColumn('categories', 'deletedAt');
    await queryInterface.removeColumn('users', 'deletedAt');
    await queryInterface.removeColumn('services', 'deletedAt');
    await queryInterface.removeColumn('schedules', 'deletedAt');
    await queryInterface.removeColumn('products', 'deletedAt');
    await queryInterface.removeColumn('reports', 'deletedAt');
    await queryInterface.removeColumn('sales', 'deletedAt');
  },
};
