const mongoose = require("mongoose");

/* Service Request Schema */

const RequestSchema = new mongoose.Schema({

  userEmail: {
    type: String,
    required: true
  },

  vehicleNumber: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});


/* Main Service Provider Schema */

const ServiceProviderSchema = new mongoose.Schema({

  center: {
    type: String,
    required: true
  },

  owner: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  city: {
    type: String,
    required: true
  },

  mechanics: {
    type: Number,
    required: true
  },

  pincode: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["service"],
    default: "service"
  },

  /* List of incoming service requests */

  serviceRequests: [RequestSchema],

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "ServiceProvider",
  ServiceProviderSchema
);