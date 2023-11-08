module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('schedules', 'averageTime', {
      type: Sequelize.INTEGER,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('schedules', 'averageTime');
  },
};
