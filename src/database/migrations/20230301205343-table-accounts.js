module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('accounts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: Sequelize.STRING,
      type: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      trial: Sequelize.BOOLEAN,
      enable: Sequelize.BOOLEAN,
      dueDate: Sequelize.DATE,
      token: {
        type: Sequelize.STRING,
      },
      config: {
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
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('accounts');
  },
};
