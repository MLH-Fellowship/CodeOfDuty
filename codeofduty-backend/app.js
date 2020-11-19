const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const models = require('./models')

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({message: 'hello world!'})
});

app.get("/fetchSprints", (req, res) => {
    const user = req.query.user;
    models.Repo.find({"contributors.user":user}).sort({due_date: 'desc'}).exec(function(err, docs) { 
        return res.send(docs);
     });
});

module.exports = app;
