module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('historic_prices', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      oldValue: Sequelize.DOUBLE,
      newValue: Sequelize.DOUBLE,
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.dropTable('historic_prices'),
};
