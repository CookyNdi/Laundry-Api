"use strict";

const fs = require("fs");
const path = require("path");
const Address = require("../models/Address.js");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const filePath = path.join(__dirname, "../data/address.json");
    let data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    data.forEach((element) => {
      element.createdAt = new Date();
      element.updatedAt = new Date();
    });
    await Address.bulkCreate(data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("address", null);
  },
};
