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
      name:req.body.name,
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
    await user.save();
    const got_user = await User.findOne({ email });
    console.log("User saved successfully:", got_user);

    await sendWelcomeMail(email, name);
     
    res.json({ message: "User registered successfully" });

  } catch (error) {

    res.status(500).json(error);

  }

};