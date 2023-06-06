const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRouter = require("./src/routers/Users.js");
const servicePackageRouter = require("./src/routers/ServicePackage.js");
const transactionsRouter = require("./src/routers/Transactions.js");
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use(userRouter);
app.use(servicePackageRouter);
app.use(transactionsRouter);

app.listen(port, () => {
  console.log(`server running perfectly at port ${port}`);
});
