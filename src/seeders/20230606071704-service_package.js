"use strict";

const fs = require("fs");
const path = require("path");
const ServicePackage = require("../models/ServicePackage.js");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const filePath = path.join(__dirname, "../data/service-package.json");
    let data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    data.forEach((element) => {
      element.createdAt = new Date();
      element.updatedAt = new Date();
    });
    await ServicePackage.bulkCreate(data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("service_package", null);
  },
};
