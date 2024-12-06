"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Token, {
        as: "my_tokens",
        foreignKey: {
          name: "user_id",
        },
      });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "full_name",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      loginAttempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "login_attempts",
      },
      isLocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_locked",
      },
      nextUnlockTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "next_unlock_time",
      },
      lastActivity: {
        type: DataTypes.DATE,
        defaultValue: Date.now(),
        field: "last_activity",
        allowNull: true,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "reset_password_token",
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "reset_password_expires",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    },
  );
  return User;
};
