const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const request = require("superagent");
require("dotenv").config();

const app = express();
const models = require("./models");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "hello world!" });
});

function createWebhook(token, repo, event, url) {
  return request
    .post(`https://api.github.com/repos/${repo}/hooks`)
    .set("Accept", "application/vnd.github.v3+json")
    .set("Authorization", `token ${token}`)
    .set("User-Agent", "CodeOfDuty")
    .send({
      name: "web",
      config: {
        url,
        content_type: "json",
        insecure_ssl: 0,
      },
      events: [event],
    })
    .then((result) => result)
    .catch((err) => err);
}

function getUser(token) {
  return request
    .get("https://api.github.com/user")
    .set("Authorization", `token ${token}`)
    .set("User-Agent", "CodeOfDuty")
    .set("Accept", "application/json")
    .then((result) => {
      const userBody = result.body;
      return userBody;
    })
    .catch((err) => {
      throw err;
    });
}

function getAccessToken(code) {
  return request
    .post("https://github.com/login/oauth/access_token")
    .send({
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      code,
    })
    .set("Accept", "application/json")
    .then((res) => res.body.access_token)
    .catch((err) => {
      throw err;
    });
}

app.post("/createWebhook", async (req, res) => {
  // eslint-disable-next-line object-curly-newline
  const { token, repo, event, url } = req.body;
  const webhookRes = await createWebhook(token, repo, event, url);
  res.send(webhookRes);
});

app.get("/authenticate", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send({
      message: "Error: no code",
    });
  }
  try {
    const token = await getAccessToken(code);
    const user = await getUser(token);
    return res.status(200).send({ token, user });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

app.get("/fetchUserSprints", (req, res) => {
  const { user } = req.query;
  models.Sprint.find({ "contributors.user": user })
    .sort({ due_date: "desc" })
    .exec((err, docs) => res.send(docs));
});

app.get("/fetchGlobalSprints", (req, res) => {
  models.Sprint.find()
    .sort({ due_date: "desc" })
    .limit(10)
    .exec((err, docs) => res.send(docs));
});

app.post("/issue", async (req, res) => {
  if (req.body.action === "milestoned") {
    let points = 0;
    req.body.issue.labels.forEach(async (label) => {
      if (!label.name.NaN) {
        points = parseInt(label.name, 10);
        await models.Sprint.findOneAndUpdate(
          { milestone_url: req.body.milestone.html_url },
          { $inc: { boss_hp: points, boss_hp_max: points } },
        );
      }
    });

    if (req.body.issue.assignee) {
      const assignee = req.body.issue.assignee.login;
      const contributors = await models.Sprint.findOne({
        milestone_url: req.body.milestone.html_url,
        "contributors.user": assignee,
      });
      if (contributors) {
        await models.Sprint.findOneAndUpdate(
          {
            milestone_url: req.body.milestone.html_url,
            "contributors.user": assignee,
          },
          { $inc: { "contributors.$.points_at_stake": points } },
        );
      } else {
        const contributor = {
          user: assignee,
          points_claimed: 0,
          points_at_stake: points,
        };
        await models.Sprint.findOneAndUpdate(
          { milestone_url: req.body.milestone.html_url },
          { $push: { contributors: contributor } },
        );
      }
      const task = {
        issue_url: req.body.issue.html_url,
        pr_url: null,
        task_status: "in-progress",
        contributor: assignee,
        reviewer: null,
        contributor_points: 0.8 * points,
        reviewer_points: 0.2 * points,
      };
      await models.Sprint.findOneAndUpdate(
        { milestone_url: req.body.milestone.html_url },
        { $push: { tasks: task } },
      );
    } else {
      const task = {
        issue_url: req.body.issue.html_url,
        pr_url: null,
        task_status: "in-progress",
        contributor: null,
        reviewer: null,
        contributor_points: 0.8 * points,
        reviewer_points: 0.2 * points,
      };
      await models.Sprint.findOneAndUpdate(
        { milestone_url: req.body.milestone.html_url },
        { $push: { tasks: task } },
      );
    }
  } else if (req.body.action === "demilestoned") {
    let points = 0;
    req.body.issue.labels.forEach(async (label) => {
      if (!label.name.NaN) {
        points = parseInt(label.name, 10);
        await models.Sprint.findOneAndUpdate(
          { milestone_url: req.body.milestone.html_url },
          { $inc: { boss_hp: -points, boss_hp_max: -points } },
        );
      }
    });
    if (req.body.issue.assignee) {
      const assignee = req.body.issue.assignee.login;
      const contributors = await models.Sprint.findOne({
        milestone_url: req.body.milestone.html_url,
        "contributors.user": assignee,
      });
      if (contributors) {
        await models.Sprint.findOneAndUpdate(
          {
            milestone_url: req.body.milestone.html_url,
            "contributors.user": assignee,
          },
          { $inc: { "contributors.$.points_at_stake": -points } },
        );
      } else {
        const contributor = {
          user: assignee,
          points_claimed: 0,
          points_at_stake: -points,
        };
        await models.Sprint.findOneAndUpdate(
          { milestone_url: req.body.milestone.html_url },
          { $push: { contributors: contributor } },
        );
      }
    }
  }
  if (req.body.action === "assigned") {
    if (req.body.issue.milestone) {
      console.log("here");
      let points = 0;
      req.body.issue.labels.forEach(async (label) => {
        if (!label.name.NaN) {
          points = parseInt(label.name, 10);
        }
      });
      const assignee = req.body.assignee.login;
      const contributors = await models.Sprint.findOne({
        milestone_url: req.body.issue.milestone.html_url,
        "contributors.user": assignee,
      });
      if (contributors.length > 0) {
        await models.Sprint.findOneAndUpdate(
          {
            milestone_url: req.body.issue.milestone.html_url,
            "contributors.user": assignee,
          },
          { $inc: { "contributors.$.points_at_stake": points } },
        );
      } else {
        const contributor = {
          user: assignee,
          points_claimed: 0,
          points_at_stake: points,
        };
        await models.Sprint.findOneAndUpdate(
          { milestone_url: req.body.issue.milestone.html_url },
          { $push: { contributors: contributor } },
        );
      }
      console.log(
        req.body.issue.milestone.html_url,
        req.body.issue.html_url,
        assignee,
      );
      await models.Sprint.findOneAndUpdate(
        {
          milestone_url: req.body.issue.milestone.html_url,
          "tasks.issue_url": req.body.issue.html_url,
        },
        { "tasks.$.contributor": assignee },
      );
    }
  }

  res.send({
    statusCode: 200,
    message: "Done",
  });
});

module.exports = app;
