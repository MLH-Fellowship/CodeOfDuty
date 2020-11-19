const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('superagent');
const { OAUTH_CLIENT_ID, OAUTH_SCOPES, OAUTH_CLIENT_SECRET } = require('./config');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({message: 'hello world!'})
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
            client_id: OAUTH_CLIENT_ID,
            client_secret: OAUTH_CLIENT_SECRET,
            code: code
        })
        .set('Accept', 'application/json')
        .then(res => {
            const { access_token } = res.body;
            return access_token;
        })
}

module.exports = app;
