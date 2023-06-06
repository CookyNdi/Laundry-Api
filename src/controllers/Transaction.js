const Transactions = require("../models/Transactions.js");
const ServicePackage = require("../models/ServicePackage.js");
const TransactionDetails = require("../models/TransactionDetails.js");
const { Op } = require("sequelize");

const getTransactions = async (req, res) => {
  if (req.role === "admin") {
    try {
      const response = await Transactions.findAll({
        attributes: ["id", "userId", "no_order", "name", "dateIn", "dateOut", "service_packageId", "price"],
      });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  } else if (req.role === "user") {
    try {
      const response = await Transactions.findAll(
        {
          attributes: ["id", "userId", "no_order", "name", "dateIn", "dateOut", "service_packageId", "price"],
        },
        {
          where: {
            userId: req.userId,
          },
        }
      );
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  }
};
const createTransactions = async (req, res) => {
  const { name, service_package, payment_method } = req.body;

  const now = new Date();
  const padZero = (number) => {
    return number.toString().padStart(2, "0");
  };
  const no_order = `${now.getFullYear()}${padZero(now.getMonth() + 1)}${padZero(now.getDate())}${padZero(
    now.getHours()
  )}${padZero(now.getMinutes())}${padZero(now.getSeconds())}`;

  const dateIn = `${padZero(now.getDate())}-${padZero(now.getMonth() + 1)}-${now.getFullYear()}`;

  const getServicePackage = await ServicePackage.findOne({
    where: {
      id: service_package,
    },
  });

  const dateOut = `${padZero(now.getDate())}-${padZero(
    now.getMonth() + 1 + getServicePackage.day
  )}-${now.getFullYear()}`;

  const servicePackagePrice = await ServicePackage.findOne({
    attributes: ["price"],
    where: {
      id: service_package,
    },
  });

  try {
    await Transactions.create({
      userId: req.userId,
      no_order: no_order,
      name: name,
      dateIn: dateIn,
      dateOut: dateOut,
      service_packageId: service_package,
      price: servicePackagePrice.price,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }

  const transactions = await Transactions.findOne({
    attributes: ["id"],
    where: {
      [Op.and]: [{ userId: req.userId }, { no_order: no_order }],
    },
  });
  const status = "Belum Dibayar";
  try {
    await TransactionDetails.create({
      transactionId: transactions.id,
      payment_method: payment_method,
      status: status,
    });
    res.status(201).json({ msg: "Transaction Telah Berhasil, Menunggu Pembayaran" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getAllTransactionDetails = async (req, res) => {
  try {
    const response = await TransactionDetails.findAll(
      {
        attributes: ["id", "transactionId", "payment_method", "status"],
      },
      {
        where: {
          userId: req.userId,
        },
      }
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const payTransaction = async (req, res) => {
  const transaction = await TransactionDetails.findOne({
    attributes: ["id", "transactionId", "payment_method", "status"],
    where: {
      transactionId: req.params.id,
    },
  });
  if (!transaction) return res.status(404).json({ msg: "Transaction Failed" });
  try {
    await TransactionDetails.update(
      {
        status: req.body.status,
      },
      {
        where: {
          id: transaction.id,
        },
      }
    );
    res.status(200).json({ msg: "Pembayaran Telah Berhasil" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getTransactions,
  createTransactions,
  getAllTransactionDetails,
  payTransaction,
};
