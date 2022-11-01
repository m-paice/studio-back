'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: 'ed4788d7-7ff7-4a59-bf52-1696b2dc377b',
          name: 'Matheus Paice',
          type: 'pf',
          cellPhone: '14998022422',
          password: '1234',
          isSuperAdmin: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
