const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");

router
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(async (req, res) => {
    await check("username", "Name is required").notEmpty().run(req);
    await check("email", "Email is required").notEmpty().isEmail().run(req);
    await check("password", "Password is required").notEmpty().run(req);
    await check("confirm_password", "Confirm password is required")
      .notEmpty()
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match")
      .run(req);

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, async function (err, hash) {
          if (err) throw err;
          newUser.password = hash;
          try {
            await newUser.save();
            res.redirect("/login");
          } catch (err) {
            console.log(err);
            res.send("Could not save user");
          }
        });
      });
    } else {
      res.render("register", {
        errors: errors.array(),
      });
    }
  });

router
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post(passport.authenticate("local", {
    successRedirect: "/movies",
    failureRedirect: "/login",
    failureFlash: true
  }));

  // Logout route
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
      });
    });
  

module.exports = router;
