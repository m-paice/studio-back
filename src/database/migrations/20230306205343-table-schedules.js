module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('schedules', {
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
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      employeeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      shortName: {
        type: Sequelize.STRING,
      },
      scheduleAt: Sequelize.DATE,
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending',
      },
      discount: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
      },
      addition: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
      },
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

  down: (queryInterface) => queryInterface.dropTable('schedules'),
};
