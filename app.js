var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var pgp = require('pg-promise')({});
var cors = require('cors');
var https = require('https');
var fs = require('fs');
var crypto = require('crypto');
var app = express();

const route = require("./routes");
const port = 8082;
const base_url = "http://localhost:"+port+"/";
console.log(base_url);
app.set('base_url', base_url);
app.use("/upload", express.static("./upload"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(cors());



app.post('/admin_chk', async (req, res, next) => {
  obj = {
      status: "fail",
      message: "Following fields are required for signing up",
  };
res.json(obj);
});

// Import all defined routes
// app.use('/api/', require('./controllers/index'));
console.log("Routes initializing");
app.use("/", route);



app.listen(port, () => {
  console.log(`Example app listening at `+base_url)
})

module.exports = app;
