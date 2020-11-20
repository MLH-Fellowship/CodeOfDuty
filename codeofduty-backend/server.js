/* eslint-disable no-console */
const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

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

app.listen(port, () => console.log(`Server starting on port ${port}!`));
