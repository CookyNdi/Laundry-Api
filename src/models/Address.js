const Sequelize = require("sequelize");
const db = require("../configs/db.js");
const Users = require("./Users.js");
const AuditLogs = require("./AuditLogs.js");

const { DataTypes } = Sequelize;

const Address = db.define(
  "address",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    rt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rw: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kecamatan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kabupaten: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(Address);
Address.belongsTo(Users, { foreignKey: "userId" });

Address.afterCreate((address, options) => {
  const auditLog = {
    table_name: "address",
    task: "create",
    description: `Address with ID ${address.id} and user ID ${address.userId} has been created.`,
  };

  AuditLogs.create(auditLog);
});

module.exports = Address;
