const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  name: String,
  email: { type: String,  },
  password: String,
  phone: String,
  city: String,

  role: {
    type: String,
    enum: ["owner", "service_provider", "admin"]
  },

  vehicle: {
    vehicleNumber: String,
    manufacturer: String,
    model: String,
    year: Number,
    mileage: Number
  },

  serviceCenter: {
    centerName: String,
    mechanics: Number
  }

});

module.exports = mongoose.model("User", UserSchema);