const express = require("express");
const { getTransactions, createTransactions, getAllTransactionDetails,payTransaction } = require("../controllers/Transaction.js");
const { authentication } = require("../middleware/Auth.js");
const transactionsRouter = express.Router();

transactionsRouter.get("/transactions", authentication, getTransactions);
transactionsRouter.post("/transactions", authentication, createTransactions);
transactionsRouter.get("/payment", authentication, getAllTransactionDetails);
transactionsRouter.patch("/payment/:id", authentication, payTransaction);

module.exports = transactionsRouter;
