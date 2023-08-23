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
          password: '$2b$10$Pb8tDPVIN/ttDmRedBi7ZelApWCzRmqRjw0otgHMcUQKASYw/4jQ6',
          isSuperAdmin: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '065cfb6e-b1ad-4506-8c9d-e04c855b179b',
          name: 'Alexandre Barboza',
          type: 'pf',
          cellPhone: '14991038089',
          password: '$2b$10$Pb8tDPVIN/ttDmRedBi7ZelApWCzRmqRjw0otgHMcUQKASYw/4jQ6',
          isSuperAdmin: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
