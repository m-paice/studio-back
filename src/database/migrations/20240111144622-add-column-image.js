module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('services', 'image', {
      type: Sequelize.TEXT,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('services', 'image');
  },
};
