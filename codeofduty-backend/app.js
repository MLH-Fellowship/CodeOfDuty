const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const request = require("superagent");
require("dotenv").config()

const app = express();
const models = require("./models");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({message: "hello world!"})
});

app.get("/authenticate", async (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.status(400).send({
            message: "Error: no code"
        });
    }
    const token = await getAccessToken(code);
    const user = await getUser(token);
    res.status(200).send({ token, user });
})

async function getUser(token) {
    return await request
        .get("https://api.github.com/user")
        .set("Authorization", `token ${token}`)
        .set("User-Agent", "CodeOfDuty")
        .set("Accept", "application/json")
        .then(result => {
            const userBody = result.body;
            return userBody;
        })
        .catch(err => {
            console.error(err.text);
        })
}

async function getAccessToken(code) {
    return await request
        .post("https://github.com/login/oauth/access_token")
        .send({
            client_id: process.env.OAUTH_CLIENT_ID,
            client_secret: process.env.OAUTH_CLIENT_SECRET,
            code: code
        })
        .set("Accept", "application/json")
        .then(res => {
            const { access_token } = res.body;
            return access_token;
        })
}
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
