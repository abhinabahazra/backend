const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const userservices = require('../services/userServices');
const addmail = require("../services/email");
var app1 = express();

var config = require('../config');
const base_url = config.base_url;


const encrypt = text => {
  try {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
  } catch (error) {
    return 0;
  }
};

function now() {
  let curdate = new Date();
  return curdate.getTime() + curdate.getTimezoneOffset() * 60000;
}

//================= forgot password ==================//
app1.post('/forgot_password', async (req, res) => {
    //console.log('hello');
    let obj;
    let required = [];

    if (!req.body.user_id) required.push("user_id");
    if (!req.body.new_password) required.push("new_password");


    if (required.length === 0) {
        let newpassword = req.body.new_password;
        let uservalueemail = {
            id: req.body.user_id
        }

        let getUserByEmail = await userservices.findUser(uservalueemail, "id");
        
        // console.log(getUserByEmail);
        // return;
            if (getUserByEmail.status == "success") {
                let updateduser = await userservices.editUserPassword(getUserByEmail.result.num_user_id,newpassword);
                //  console.log(updateduser);
                if (updateduser.status == "success")
                 {
                    obj = { 
                        status: "success",
                         message: "Password updated successfully",
                         response:updateduser.result 
                        };
                } else {
                    obj = {
                        status: "fail",
                        message: "Sorry! An unknown error occurred"
                    };
                }
            } else {
                obj = { 
                    status: "fail", 
                    message: "user does not exist", 
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
        };
    }
    res.json(obj);
});



module.exports = app1;