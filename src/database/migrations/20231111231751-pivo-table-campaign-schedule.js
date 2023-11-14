module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('campaign_schedule', {
      campaignId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'campaigns',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      scheduleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'schedules',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      status: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('campaign_schedule');
  },
};
