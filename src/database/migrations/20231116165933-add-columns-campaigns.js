module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('campaigns', 'scheduleAt', {
      type: Sequelize.DATE,
    });

    await queryInterface.addColumn('campaigns', 'timeBeforeSchedule', {
      type: Sequelize.DECIMAL,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('campaigns', 'scheduleAt');
    await queryInterface.removeColumn('campaigns', 'timeBeforeSchedule');
  },
};
