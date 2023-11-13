module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('campaigns', {
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
      templateId: {
        type: Sequelize.UUID,
        references: {
          model: 'templates',
          key: 'id',
        },
      },
      name: Sequelize.STRING,
      status: Sequelize.STRING,
      content: Sequelize.TEXT,
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

  down: (queryInterface) => queryInterface.dropTable('campaigns'),
};
