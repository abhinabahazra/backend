const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sleep = require('util').promisify(setTimeout);
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const sign = require("../services/jwt").sign;
const userservices = require('../services/userServices');
var app1 = express();
const addmail = require("../services/Email");
const sms = require("../services/sms");
var config = require('../config');
const base_url = config.base_url;
const redirect_url =config.redirect_url; 


  app1.post("/verify_phone", async (req, res) => {
    let required = [];
    let num_user_id;
    if (!req.body.num_user_id) required.push("num_user_id");
    let obj = {};
    if (required.length === 0) {

      let uservaluebyid = {
        id: req.body.num_user_id
    }
      let getUserById = await userservices.findUser(uservaluebyid, "id");
      let status = '1';
        if (getUserById.status == "success") {
          let updatePhoneverify = await userservices.updatePhoneVerifyById(req.body.num_user_id,status);
          if (updatePhoneverify.status == "success") {
            obj = {
              status: "success",
              message: "Phone verified successfully",
              response: ""
          };
          }else{
              obj = {
                  status: "fail",
                  message: "Sorry! cannot verify Phone"
              };
   
          }
      } else {
          obj = {
                status: "fail",
                message: "User does not exist",
                response: ""
            };
      }
    } else {
        let message = required.map((item) => {
            return " " + item;
        });
        obj = {
            status: "fail",
            message: "Following fields are required for signing up - " + message,
        }
    }
    res.json(obj);
  });

  


module.exports = app1;