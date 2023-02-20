const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();

const port: number = Number(process.env.SERVER_PORT) || 5000;
const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));


const mongooseOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect(process.env.MONGO_URI, mongooseOption)
  .then(() => {
    app.listen(port, () => {
      console.log("Server start on port " + port);
    });
  })
  .catch(() => {
      console.error("Server failed to start.");
    }
  );


