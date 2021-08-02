const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sleep = require('util').promisify(setTimeout);
const sign = require("../services/jwt").sign;
const userservices = require('../services/userServices');
var app1 = express();



//========= sign-in ==========================
app1.get("/user_type_list", async (req, res) => {
    let obj;
    let getUserType = await userservices.usertype();
    if (getUserType.status == 'success') {
        obj = {
            status: "success",
            message: "user type list",
            response: getUserType.result
        };
    } else {
        obj = {
            status: "fail",
            message: "list not found",
            response: ""
        };
    }
    res.json(obj);
  });


module.exports = app1;