const app = require('./app');
const mongoose = require('mongoose');

// Server listening on port
const port = process.env.port || 5000;

// Uri to connect mongodb
const uri = require('./config').ATLAS_URI;

// Connect to DB
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
})

app.listen(port, () => console.log(`Server starting on port ${port}!`));