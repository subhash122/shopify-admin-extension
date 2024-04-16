const dotenv = require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require('body-parser');
const saveUserDetails = require('./user');
const cors = require('cors')

const app = express();
const port = 4000
const uri = process.env.DB;

app.use(cors())
app.use(bodyParser.json());

mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB connection successful!"));



app.post('/userdetails', saveUserDetails)

app.listen(port, () => {
    console.log(`listening on port: ${port}`)
});