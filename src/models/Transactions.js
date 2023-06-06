const Sequelize = require("sequelize");
const db = require("../configs/db.js");
const Users = require("./Users.js");
const ServicePackage = require("./ServicePackage.js");
const AuditLogs = require("./AuditLogs.js");

const { DataTypes } = Sequelize;

const Transactions = db.define(
  "transactions",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    no_order: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateIn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOut: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    service_packageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(Transactions);
Transactions.belongsTo(Users, { foreignKey: "userId" });
ServicePackage.hasMany(Transactions);
Transactions.belongsTo(ServicePackage, { foreignKey: "service_packageId" });

Transactions.afterCreate((transactions, options) => {
  const auditLog = {
    table_name: "transactions",
    task: "create",
    description: `Transactions with No Order ${transactions.no_order} and name ${transactions.name} has been created.`,
  };

  AuditLogs.create(auditLog);
});

module.exports = Transactions;
