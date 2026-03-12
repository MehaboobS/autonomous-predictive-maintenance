const express = require("express");
const router = express.Router({ "mergeParams": true });

const User = require("../models/User");

router.get("/:id", async (req, res) => {

  try {
    const userId = req.params.id;
    console.log("Fetching vehicle data for user ID:", userId);
    const user = await User.findById(userId);
    console.log("User found:", user);
    res.json({
      vehicle: {
        vehicleNumber: user.vehicle.vehicleNumber,
        manufacturer: user.vehicle.manufacturer,
        model: user.vehicle.model,
        year: user.vehicle.year,
        mileage: user.vehicle.mileage
      }
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

});

module.exports = router;