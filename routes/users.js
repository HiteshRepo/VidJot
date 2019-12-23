const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
//const passport = require("passport");
const router = express.Router();

//Load User model
require("../models/User");
const Users = mongoose.model("users");

// Add user login route
router.get("/login", (req, res) => {
  res.render("users/login");
});

// Add user register route
router.get("/register", (req, res) => {
  res.render("users/register");
});

// Add user register process
router.post("/register", (req, res) => {
  let errors = [];

  if (req.body.password !== req.body.password2) {
    errors.push({ text: "Passwords do not match" });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: "Password too short" });
  }

  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    let newUser = new Users({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          throw err;
        }
        newUser.password = hash;
        newUser
          .save()
          .then(user => {
            req.flash("success_msg", "You ar registered to login");
            res.redirect("/users/login");
          })
          .catch(err => {
            console.log(err);
            return;
          });
      });
    });

    //res.send("passed");
  }
});

module.exports = router;
