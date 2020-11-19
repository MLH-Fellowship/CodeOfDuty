const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('superagent');
require('dotenv').config()

const app = express();
const models = require("./models");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({message: 'hello world!'})
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
        .get('https://api.github.com/user')
        .set('Authorization', `token ${token}`)
        .set('User-Agent', 'CodeOfDuty')
        .set('Accept', 'application/json')
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
        .post('https://github.com/login/oauth/access_token')
        .send({
            client_id: process.env.OAUTH_CLIENT_ID,
            client_secret: process.env.OAUTH_CLIENT_SECRET,
            code: code
        })
        .set('Accept', 'application/json')
        .then(res => {
            const { access_token } = res.body;
            return access_token;
        })
}

module.exports = app;
