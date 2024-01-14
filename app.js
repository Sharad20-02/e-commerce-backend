const express = require('express');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/router');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.use('/', router);
const start = () => {
  connectDB();
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}...................`);
  });
};
start();
