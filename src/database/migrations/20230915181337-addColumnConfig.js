/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('accounts', 'config', {
      type: Sequelize.JSONB,
      defaultValue: {
        startAt: 7,
        endAt: 20,
        days: {
          dom: true,
          seg: true,
          ter: true,
          qua: true,
          qui: true,
          sex: true,
          sab: true,
        },
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('accounts', 'config');
  },
};
