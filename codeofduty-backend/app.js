//Libraries
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Server listening on port
const port = process.env.port || 5000;
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

// Uri to connect mongodb
const uri = require('./config').ATLAS_URI;

// Connect to DB
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
})