'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.STRING,
      allowNull: true, // Modify as per your requirements
      defaultValue: 'user', // Default value for existing users
    });
  },
};
