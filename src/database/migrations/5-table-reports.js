module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('reports', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      scheduleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'schedules',
          key: 'id',
        },
      },
      entry: Sequelize.DOUBLE,
      out: Sequelize.DOUBLE,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('reports'),
};
