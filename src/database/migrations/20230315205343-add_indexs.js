module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(
      'CREATE INDEX IF NOT EXISTS schedules_userid_employeeid_scheduleat_index ON schedules ("userId","employeeId","scheduleAt")',
    );
  },
  down: async (queryInterface) => queryInterface.sequelize.query('DROP INDEX schedules_userid_employeeid_index'),
};
