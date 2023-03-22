module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('product_service', {
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      serviceId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'services',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.dropTable('product_service'),
};
