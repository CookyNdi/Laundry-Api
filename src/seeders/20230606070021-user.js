"use strict";

const fs = require("fs");
const path = require("path");
const Users = require("../models/Users.js");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const filePath = path.join(__dirname, "../data/user.json");
    let data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    data.forEach((element) => {
      element.createdAt = new Date();
      element.updatedAt = new Date();
    });
    await Users.bulkCreate(data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null);
  },
};
