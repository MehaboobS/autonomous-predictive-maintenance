const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendWelcomeMail = require("../services/mailService");

exports.register = async (req, res) => {

  try {

    console.log("Received registration request:", req.body);

    const { name, email, password } = req.body;

    console.log("Registering user:", email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      city: req.body.city,
      role: "owner",

      password: hashedPassword,

      vehicle: {
        vehicleNumber: req.body.vehicleNumber,
        manufacturer: req.body.manufacturer,
        model: req.body.model,
        year: req.body.year,
        mileage: req.body.mileage
      }
    });

    console.log("Saving user to database:", user);

    const savedUser = await user.save();

    console.log("User saved successfully:", savedUser);

    // Send mail but don't break signup if it fails
    try {
      await sendWelcomeMail(email, name);
    } catch (mailError) {
      console.log("Email sending failed:", mailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully"
    });

  } catch (error) {

    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed"
    });

  }

};