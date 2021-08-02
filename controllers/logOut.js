const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var app = express();

app.post('/logout',function(req,res){   
  let obj;
  let required = [];
if (!req.body.token) required.push("token");
if (required.length === 0) {
    let token = req.body.token;
    jwt.destroy(token)
  obj = { status: "success", message: "User successfully louout" };
} else {
  let message = required.map((item) => {
      return " " + item;
  });
  obj = {
      status: "fail",
      message: "Following fields are required for signing up - " + message,
  };
}
res.json(obj);
});  

module.exports = app;