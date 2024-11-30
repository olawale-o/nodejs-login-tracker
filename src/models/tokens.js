"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Token.belongsTo(models.User, {
        foreignKey: {
          name: "user_id",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        onDelete: "CASCADE",
      });
    }
  }
  Token.init(
    {
      accessToken: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "access_token",
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "refresh_token",
      },
      isExpired: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
        default: false,
        field: "is_expired",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: "created_at",
        defaultValue: Date.now(),
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Token",
      tableName: "tokens",
      timestamps: false,
    },
  );
  return Token;
};
