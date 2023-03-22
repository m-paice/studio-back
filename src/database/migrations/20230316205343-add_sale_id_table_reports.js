'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('reports', 'saleId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'sales',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('reports', 'saleId');
  },
};
