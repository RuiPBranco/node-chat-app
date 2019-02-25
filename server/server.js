// load config
require('./config/config');
// get public path
const path= require('path');
const publicPath=path.join(__dirname, '../public');
// get express
const express = require('express');
// const bodyParser = require('body-parser');

var app = express();
const port = process.env.PORT;

app.use(express.static(publicPath));








app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};