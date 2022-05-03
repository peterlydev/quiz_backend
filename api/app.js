const express = require('express')
const app = express();
const cors = require('cors');

app.use(cors())

app.get('/', function (req, res) {
    res.send("You're a Quizzard, Harry!")
  })


module.exports = app;
