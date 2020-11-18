//Libraries
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const models = require("./models");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Server listening on port
const port = process.env.port || 5000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Uri to connect mongodb
const uri = require("./config").ATLAS_URI;

// Connect to DB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
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
  console.log(sampleRepo);
});
