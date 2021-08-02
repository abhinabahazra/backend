const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sleep = require('util').promisify(setTimeout);
const jwt = require('jsonwebtoken');
const sign = require("../services/jwt").sign;
const userservices = require('../services/userServices');
var app1 = express();


function now() {
  let curdate = new Date();
  return curdate.getTime() + curdate.getTimezoneOffset() * 60000;
}


//========= sign-in ==========================
app1.post("/user_signin", async (req, res) => {
    let userobj;
    let required = [];

    if (!req.body.username) required.push("username");
    if (!req.body.password) required.push("password");
    let obj = {};
    if (required.length === 0) {
        let username = req.body.username;
        let password = req.body.password;
        let login = await userservices.signin(username, password);
        switch (login.message) {
            case "invalid_password":
                obj = {
                    status: "fail",
                    message: "The password you have entered is incorrect",
                    response: ""
                };
                break;
            case "not_found":
                obj = {
                    status: "fail",
                    message: "The username you have entered does not matched with this usertype",
                    response: ""
                };
                break;
            default:
                if (login.result != "") {
                    token = sign({ 
                        num_user_id: login.result.num_user_id, 
                        num_master_id: login.result.num_master_id, 
                        txt_user_id: login.result.txt_user_id, 
                        txt_gender: login.result.txt_gender, 
                        num_mobile_no: login.result.num_mobile_no, 
                        txt_emailid: login.result.txt_emailid,
                        first_name: login.result.first_name, 
                        last_name: login.result.last_name,
                        yn_mobile_verified: login.result.yn_mobile_verified, 
                        yn_email_verified: login.result.yn_email_verified, 
                        txt_active: login.result.txt_active
                    });
                    userobj = {
                        num_master_id: login.result.num_master_id, 
                        num_user_id: login.result.num_user_id, 
                        txt_user_id: login.result.txt_user_id, 
                        txt_gender: login.result.txt_gender, 
                        txt_user_dob: login.result.txt_user_dob, 
                        txt_emailid: login.result.txt_emailid,
                        num_mobile_no: login.result.num_mobile_no, 
                        txt_address_1: login.result.txt_address_1, 
                        txt_address_2: login.result.txt_address_2, 
                        num_pin_code: login.result.num_pin_code, 
                        dat_creation_date: login.result.dat_creation_date, 
                        first_name: login.result.first_name, 
                        last_name: login.result.last_name,
                        yn_mobile_verified: login.result.yn_mobile_verified, 
                        yn_email_verified: login.result.yn_email_verified, 
                        txt_active: login.result.txt_active,
                        token: token,
                    };

                }
                obj = {
                    status: "success",
                    message: "Successfully logged in",
                    response: userobj
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