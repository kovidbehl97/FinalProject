// Import passport-local, bcrypt and user schema
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = function (passport) {
  // Local Strategy
  passport.use(
    // Create local strategy with email as username
    new LocalStrategy({ usernameField: "username" }, async function (
      username,
      password,
      done
    ) {
      // Use email to query user
      let query = { username: username };
      let user = await User.findOne(query)
      // If user is not found
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      // Verify hashed password
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) {
          console.log(err);
        }
        // If hashed passwords match
        if (isMatch) {
          // Login succeeded
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid credentials" });
        }
      });
    })
  );

  // Determines which data is saved in the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // User object attached to request under req.user
  passport.deserializeUser(function (id, done) {
    User.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err, false, { error: err });
      });
  });
};
