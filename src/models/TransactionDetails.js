const Sequelize = require("sequelize");
const db = require("../configs/db.js");
const Transactions = require("./Transactions.js");
const AuditLogs = require("./AuditLogs.js");

const { DataTypes } = Sequelize;

const TransactionDetails = db.define(
  "transaction_details",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    transactionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Transactions.hasMany(TransactionDetails);
TransactionDetails.belongsTo(Transactions, { foreignKey: "transactionId" });

TransactionDetails.afterCreate((transactionDetails, options) => {
  const auditLog = {
    table_name: "transaction_details",
    task: "create",
    description: `Transaction Details with ID ${transactionDetails.id} has been created.`,
  };

  AuditLogs.create(auditLog);
});

module.exports = TransactionDetails;
