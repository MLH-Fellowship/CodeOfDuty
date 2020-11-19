const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
<<<<<<< HEAD
const models = require('./models')
=======
const models = require("./models");
>>>>>>> 2ac3dc1a4f37775068c36533cfbab13224191ed4

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "hello world!" });
});

app.get("/repo", (req, res) => {
  const sampleRepo = new models.Repo({
    _id: "owner/repo",
    repo_url: "https://codeofduty.com/owner/repo",
    maintainers: ["cqvu", "ajwad-shaikh", "vrusti-mody"],
    past_sprints: [
      {
        sprint_object: "542c2b97bac0595474108b48",
        sprint_name: "Sprint 5 | v1.2.2",
        sprint_url: "https://codeofduty.com/owner/repo/10",
      },
    ],
    active_sprints: [
      {
        sprint_object: "542c2b97bac0595474108b48",
        sprint_name: "Sprint 6 | v1.3.2",
        sprint_url: "https://codeofduty.com/owner/repo/12",
      },
    ],
    contributors: [
      {
        user: "cqvu",
        points_claimed: 20,
      },
      {
        user: "ajwad-shaikh",
        points_claimed: 10,
      },
    ],
  });
  res.status(200).json(sampleRepo);
});

app.get("/fetchSprints", (req, res) => {
    const user = req.query.user;
    models.Repo.find({"contributors.user":user}).sort({due_date: 'desc'}).exec(function(err, docs) { 
        return res.send(docs);
     });
});

module.exports = app;
