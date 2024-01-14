const mongoose = require("mongoose");
require("dotenv").config();
const connectDb = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`Successfully connected to MongoDb`);
    })
    .catch((err) => {
      console.log("Error in connecting to MongoDb", err);
    });
};

module.exports = connectDb;
