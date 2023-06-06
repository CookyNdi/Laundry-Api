const ServicePackage = require("../models/ServicePackage.js");

const getAllServicePackage = async (req, res) => {
  try {
    const response = await ServicePackage.findAll({
      attributes: ["id", "name", "description", "day", "price"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createServicePackage = async (req, res) => {
  if (req.role === "admin") {
    const { name, description, day, price } = req.body;
    try {
      await ServicePackage.create({
        name: name,
        description: description,
        day: day,
        price: price,
      });
      res.status(201).json({ msg: "Service Package Created Succesfully" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  } else {
    return res.status(401).json({ msg: "Akses Ditolak" });
  }
};

const updateServicePackage = async (req, res) => {
  if (req.role === "admin") {
    const { name, description, day, price } = req.body;
    try {
      await ServicePackage.update(
        {
          name: name,
          description: description,
          day: day,
          price: price,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(200).json({ msg: "Service Package Updated Succesfully" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  } else {
    return res.status(401).json({ msg: "Akses Ditolak" });
  }
};

const deleteServicePackage = async (req, res) => {
  if (req.role === "admin") {
    try {
      await ServicePackage.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ msg: "Service Package Deleted" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  } else {
    return res.status(401).json({ msg: "Akses Ditolak" });
  }
};

module.exports = {
  getAllServicePackage,
  createServicePackage,
  updateServicePackage,
  deleteServicePackage,
};
