const Sequelize = require("sequelize");
const db = require("../configs/db.js");
const AuditLogs = require("./AuditLogs.js");

const { DataTypes } = Sequelize;

const Users = db.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Users.afterCreate((user, options) => {
  const auditLog = {
    table_name: "users",
    task: "create",
    description: `User with ID ${user.id} and email ${user.email} has been created.`,
  };

  AuditLogs.create(auditLog);
});


module.exports = Users;
