const Telemetry = require("../models/Telemetry");
const generateTelemetry = require("./simulateTelemetry");
const predictFailure = require("./predictService");

async function startSimulation(user){

  setInterval(async ()=>{

    const telemetry = generateTelemetry();
   console.log("Generated telemetry:", telemetry);
    const probability = await predictFailure(telemetry);

    await Telemetry.create({

      userId:user._id,

      vehicleNumber:user.vehicle.vehicleNumber,

      ...telemetry,

      failure_probability:probability

    });

    console.log("Telemetry stored:",probability);

  },10000);

}

module.exports = startSimulation;