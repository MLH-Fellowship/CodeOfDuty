const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const models = require("./models");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "hello world!" });
});

app.get("/fetchUserSprints", (req, res) => {
  const user = req.query.user;
  models.Sprint.find({ "contributors.user": user })
    .sort({ due_date: "desc" })
    .exec(function (err, docs) {
      return res.send(docs);
    });
});

app.get("/fetchGlobalSprints", (req, res) => {
  models.Sprint.find()
    .sort({ due_date: "desc" })
    .limit(10)
    .exec(function (err, docs) {
      return res.send(docs);
    });
});

module.exports = app;
