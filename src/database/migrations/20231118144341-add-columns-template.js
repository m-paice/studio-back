module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('templates', 'name', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('templates', 'name');
  },
};
