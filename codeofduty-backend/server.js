/* eslint-disable camelcase */
/* eslint-disable no-console */
const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();
// eslint-disable-next-line import/order
const SmeeClient = require("smee-client");

// Server listening on port
const port = process.env.PORT || 5000;

// Uri to connect mongodb
const uri = process.env.ATLAS_URI;

// Connect to DB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

const smee_issue = new SmeeClient({
  source: process.env.ISSUE_WEBHOOK_URL,
  target: "http://localhost:5000/issue",
  logger: console,
});

const smee_milestone = new SmeeClient({
  source: process.env.MILESTONE_WEBHOOK_URL,
  target: "http://localhost:5000/milestone",
  logger: console,
});

const smee_pullrequest = new SmeeClient({
  source: process.env.PR_WEBHOOK_URL,
  target: "http://localhost:5000/pullrequest",
  logger: console,
});

smee_issue.start();
smee_milestone.start();
smee_pullrequest.start();

app.listen(port, () => console.log(`Server starting on port ${port}!`));
