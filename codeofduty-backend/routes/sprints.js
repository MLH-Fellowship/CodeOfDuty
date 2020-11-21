/*
Sprints API routes
*/
const express = require("express");
const mongoose = require("mongoose");
const Sprint = require("../models.js");

const router = express.Router();

router.route("/create").post((req, res) => {
  const { repo, milestone } = req.query;
  const newSprint = new Sprint({});
});
