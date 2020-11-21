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

module.exports = app;
