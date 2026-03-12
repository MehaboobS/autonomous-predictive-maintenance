const express = require("express");
const passport = require("passport");
const User = require("../models/User");

const { register } = require("../controllers/authController");
const startSimulation = require("../services/vehicleSimulator");

const router = express.Router();

/* Register Route */

router.post("/register", register);


/* Login Route */

router.post("/login", (req, res, next) => {

  console.log("Login attempt:", req.body);

  passport.authenticate("local", (err, user, info) => {

    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).json({
        message: info.message || "Login failed"
      });
    }

    req.logIn(user, async (err) => {

      if (err) {
        return next(err);
      }

      console.log("Logged in user:", user);

      /* Determine role properly */

      let role;
      const dbuser=await User.findOne({email:user.email});

      if (user.role === "admin") {
        role = "admin";
      }
      else if (user.role === "service") {
        role = "service";
      }
      else if (user.role === "owner") {
        role = "owner";
      }
      else if (user.center) {
        role = "service";
      }
      else {
        role = "owner";
      }

      console.log("Determined role:", role);
      console.log("the db user details are ",dbuser);
      
      /* Start telemetry simulation only for vehicle owners */

      if (role === "owner") {

        try {

          startSimulation(user);

          console.log(
            "Vehicle telemetry simulation started for:",
            user.email
          );

        } catch (error) {

          console.error(
            "Simulation start failed:",
            error
          );

        }

      }

      return res.json({
        message: "Login successful",

        user: {
          id: user._id,
          name: user.name || user.owner,
          email: user.email,
          role: role
        }

      });

    });

  })(req, res, next);

});

module.exports = router;