const Sequelize = require("sequelize");
const db = require("../configs/db.js");
const AuditLogs = require("./AuditLogs.js");

const { DataTypes } = Sequelize;

const ServicePackage = db.define(
  "service_package",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

ServicePackage.afterCreate((servicePackage, options) => {
  const auditLog = {
    table_name: "service_package",
    task: "create",
    description: `Service Package with ID ${servicePackage.id} and name ${servicePackage.name} has been created.`,
  };

  AuditLogs.create(auditLog);
});

module.exports = ServicePackage;
