const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const ServiceProvider = require("../models/ServiceProvider");

module.exports = function(passport) {

  passport.use(
    new LocalStrategy(
      { usernameField: "email" },

      async (email, password, done) => {

        try {

          /* Check Vehicle Owner */
          const user = await User.findOne({ email });

          if (user) {
             if(user.role=="admin"){
                user.role = "admin";
                return done(null, user);
             }
            const isMatch = await bcrypt.compare(
              password,
              user.password
            );

            if (!isMatch) {
              return done(null, false, {
                message: "Incorrect password"
              });
            }

            user.role = "owner";

            return done(null, user);
          }

          /* Check Service Provider */
          const serviceUser = await ServiceProvider.findOne({ email });

          if (serviceUser) {
            console.log("Found service provider:", serviceUser);
            const isMatch = (password == serviceUser.password);
           console.log("Password match:", isMatch);
            if (!isMatch) {
              return done(null, false, {
                message: "Incorrect password"
              });
            }

            serviceUser.role = "service";

            return done(null, serviceUser);
          }

          /* If neither found */

          return done(null, false, {
            message: "User not found"
          });

        } catch (error) {
          return done(error);
        }

      }
    )
  );

  /* Session Handling */

  passport.serializeUser((user, done) => {
    done(null, { id: user.id, role: user.role });
  });

  passport.deserializeUser(async (data, done) => {

    try {

      if (data.role === "owner") {

        const user = await User.findById(data.id);
        return done(null, user);

      }

      if (data.role === "service") {

        const serviceUser = await ServiceProvider.findById(data.id);
        return done(null, serviceUser);

      }

    } catch (error) {
      done(error);
    }

  });

};