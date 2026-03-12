const ServiceProvider = require("../models/ServiceProvider");
const sendServiceWelcomeMail = require("../services/serviceMail");

exports.registerServiceProvider = async (req, res) => {

  try {

    const { email } = req.body;
    console.log("Registering service provider with email:", email);
    const existing = await ServiceProvider.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "Service Provider already registered"
      });
    }

    const provider = new ServiceProvider(req.body);

    await provider.save();

    await sendServiceWelcomeMail(provider.email, provider.center);

    res.json({
      message: "Service Provider Registered Successfully"
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({
      message: "Server error"
    });

  }

};