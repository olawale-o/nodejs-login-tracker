"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        "users", // table name
        "last_activity", // new field name
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn(
        "users", // table name
        "last_activity", // new field name
      ),
    ]);
  },
};
