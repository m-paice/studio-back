module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'account',
      [
        {
          id: 'ed4788d7-7ff7-4a59-bf52-1696b2dc377b',
          name: 'Ikatec',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('account', null, {}),
};
