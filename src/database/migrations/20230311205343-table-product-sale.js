module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('product_sale', {
      productId: {
        type: Sequelize.UUID,
        references: {
          model: 'products',
          key: 'id',
        },
        onDelete: 'cascade',
      },
      saleId: {
        type: Sequelize.UUID,
        references: {
          model: 'sales',
          key: 'id',
        },
        onDelete: 'cascade',
      },
      amount: Sequelize.INTEGER,
      discount: Sequelize.DOUBLE,
      addition: Sequelize.DOUBLE,
      subtotal: Sequelize.DOUBLE,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('product_sale');
  },
};
