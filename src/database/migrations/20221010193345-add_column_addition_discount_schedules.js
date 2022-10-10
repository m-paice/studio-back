'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('schedules', 'discount', {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    });

    await queryInterface.addColumn('schedules', 'addition', {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('schedules', 'discount');
    await queryInterface.removeColumn('schedules', 'addition');
  },
};
