const mongoose = require("mongoose");

const TelemetrySchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    
  },

  vehicleNumber: String,

  air_temp: Number,
  process_temp: Number,
  rpm: Number,
  torque: Number,
  tool_wear: Number,

  failure_probability: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "Telemetry",
  TelemetrySchema
);