const express = require("express");
const router = express.Router({"mergeParams": true});

const Telemetry = require("../models/Telemetry");
const generateTelemetry = require("../services/simulateTelemetry");
const predictFailure = require("../services/predictService");

router.get("/latest/:vehicleNumber", async (req, res) => {

  try {

    const vehicleNumber = req.params.vehicleNumber;

    /* 1️⃣ Generate telemetry */

    const telemetry = generateTelemetry();

    console.log("Generated telemetry:", telemetry);

    /* 2️⃣ Predict failure */

    const probability = await predictFailure(telemetry);

    /* 3️⃣ Store telemetry */

    const savedTelemetry = await Telemetry.create({

      vehicleNumber: vehicleNumber,

      ...telemetry,

      failure_probability: probability

    });

    console.log("Telemetry stored:", probability);

    /* 4️⃣ Send response */

    res.json(savedTelemetry);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Telemetry generation failed"
    });

  }

});

module.exports = router;