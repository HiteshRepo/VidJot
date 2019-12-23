const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Load Idea model
require("../models/Idea");
const Idea = mongoose.model("ideas");

// Add Idea route
router.get("/add", (req, res) => {
  res.render("ideas/add");
});

// Edit Idea Form process
router.put("/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea
      .save()
      .then(idea => {
        req.flash("success_msg", "video idea edited successfully");
        res.redirect("/ideas");
      })
      .catch(idea => {
        req.flash("error_msg", "video edited successfully");
        res.redirect("/ideas");
      });
  });
});

// Delete Idea Form process
router.delete("/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    idea.delete().then(() => {
      req.flash("success_msg", "video idea deleted successfully");
      res.redirect("/ideas");
    });
  });
});

// Edit Idea Form
router.get("/edit/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render("ideas/edit", {
      idea: idea
    });
  });
});

// Delete Idea Form
router.get("/delete/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render("ideas/delete", {
      idea: idea
    });
  });
});

// Ideas route
router.get("/", (req, res) => {
  Idea.find({})
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", { ideas: ideas });
    });
});

// Process Form
router.post("/", (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }

  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    //res.send("passed");
    let newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Idea(newUser).save().then(idea => {
      req.flash("success_msg", "video idea added successfully");
      res.redirect("/ideas");
    });
  }
});

module.exports = router;
