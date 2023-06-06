const express = require("express");
const {
  getAllServicePackage,
  createServicePackage,
  updateServicePackage,
  deleteServicePackage,
} = require("../controllers/ServicePackage.js");
const { authentication } = require("../middleware/Auth.js");
const servicePackageRouter = express.Router();

servicePackageRouter.get("/service/package", authentication, getAllServicePackage);
servicePackageRouter.post("/service/package", authentication, createServicePackage);
servicePackageRouter.patch("/service/package/:id", authentication, updateServicePackage);
servicePackageRouter.delete("/service/package/:id", authentication, deleteServicePackage);

module.exports = servicePackageRouter;
