module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('reports', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      accountId: {
        type: Sequelize.UUID,
        references: {
          model: 'accounts',
          key: 'id',
        },
      },
      scheduleId: {
        type: Sequelize.UUID,
        references: {
          model: 'schedules',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      description: {
        type: Sequelize.STRING,
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
      deletedAt: {
        type: Sequelize.DATE,
      },
    }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('reports'),
};
