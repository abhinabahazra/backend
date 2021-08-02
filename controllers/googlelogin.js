const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sleep = require('util').promisify(setTimeout);
const jwt = require('jsonwebtoken');
const sign = require("../services/jwt").sign;
const userservices = require('../services/userServices');
var app1 = express();


//========= sign-in ==========================
app1.post("/google_login", async (req, res) => {
    let userobj;
    let required = [];
    let profile_pic = "";
    if (!req.body.first_name) required.push("first_name");
    if (!req.body.last_name) required.push("last_name");
    if (!req.body.email) required.push("email");
    if (!req.body.googleId) required.push("googleId");

    if (req.body.profile_pic && req.body.profile_pic != "") {
        profile_pic = req.body.profile_pic;
    }

    let obj = {};
    if (required.length === 0) {
        let uservaluephone = {
            email: req.body.email
        }
      
        let getUserByEmail = await userservices.findUser(uservaluephone, "g_email");
        if (getUserByEmail.status == "success") {
            obj = {
                status: "fail",
                message: "Sorry! please login with your username and password."
            };
        } else {
            //================= check by googleId ===================
            let uservalueG = {
                googleId: req.body.googleId
            }
            let getUserByGoogleId = await userservices.findUser(uservalueG, "googleId");
            if (getUserByGoogleId.status == "success") {
                delete getUserByGoogleId.result.txt_password;
                token = sign({ 
                    num_user_id: getUserByGoogleId.result.num_user_id, 
                    num_master_id: getUserByGoogleId.result.num_master_id, 
                    txt_user_id: getUserByGoogleId.result.txt_user_id, 
                    txt_gender: getUserByGoogleId.result.txt_gender, 
                    num_mobile_no: getUserByGoogleId.result.num_mobile_no, 
                    txt_emailid: getUserByGoogleId.result.txt_emailid,
                    first_name: getUserByGoogleId.result.first_name, 
                    last_name: getUserByGoogleId.result.last_name,
                    yn_mobile_verified: getUserByGoogleId.result.yn_mobile_verified, 
                    yn_email_verified: getUserByGoogleId.result.yn_email_verified, 
                    txt_active: getUserByGoogleId.result.txt_active
                });
                userobj = {
                    num_master_id: getUserByGoogleId.result.num_master_id, 
                    num_user_id: getUserByGoogleId.result.num_user_id, 
                    txt_user_id: getUserByGoogleId.result.txt_user_id, 
                    txt_gender: getUserByGoogleId.result.txt_gender, 
                    txt_user_dob: getUserByGoogleId.result.txt_user_dob, 
                    txt_emailid: getUserByGoogleId.result.txt_emailid,
                    num_mobile_no: getUserByGoogleId.result.num_mobile_no, 
                    txt_address_1: getUserByGoogleId.result.txt_address_1, 
                    txt_address_2: getUserByGoogleId.result.txt_address_2, 
                    num_pin_code: getUserByGoogleId.result.num_pin_code, 
                    dat_creation_date: getUserByGoogleId.result.dat_creation_date, 
                    first_name: getUserByGoogleId.result.first_name, 
                    last_name: getUserByGoogleId.result.last_name,
                    yn_mobile_verified: getUserByGoogleId.result.yn_mobile_verified, 
                    yn_email_verified: getUserByGoogleId.result.yn_email_verified, 
                    txt_active: getUserByGoogleId.result.txt_active,
                    txt_google_id: getUserByGoogleId.result.txt_google_id,
                    txt_profile_pic: getUserByGoogleId.result.txt_profile_pic,
                    token: token,
                };
                obj = {
                    status: "success",
                    message: "google login details",
                    response : userobj
                };
            } else {
                //============ add google user ==========
                let date_ob = new Date();
                let date = ("0" + date_ob.getDate()).slice(-2);
                let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                let year = date_ob.getFullYear();
                let hours = date_ob.getHours();
                let minutes = date_ob.getMinutes();
                let seconds = date_ob.getSeconds();
                let finaldt = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        
                let userobj = {
                    num_master_id: "3",
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    txt_user_id: req.body.email,
                    txt_password: "Guest@123",
                    txt_gender: "",    
                    txt_emailid: req.body.email,
                    num_mobile_no: "",
                    dat_creation_date: finaldt,
                    yn_email_verified: "",
                    txt_active: "1",
                    txt_google_id: req.body.googleId,
                    txt_profile_pic: profile_pic
                };
                let getUserByGoogleId = await userservices.addUser(userobj);
                delete getUserByGoogleId.result.txt_password;
                token = sign({ 
                    num_user_id: getUserByGoogleId.result.num_user_id, 
                    num_master_id: getUserByGoogleId.result.num_master_id, 
                    txt_user_id: getUserByGoogleId.result.txt_user_id, 
                    txt_gender: getUserByGoogleId.result.txt_gender, 
                    num_mobile_no: getUserByGoogleId.result.num_mobile_no, 
                    txt_emailid: getUserByGoogleId.result.txt_emailid,
                    first_name: getUserByGoogleId.result.first_name, 
                    last_name: getUserByGoogleId.result.last_name,
                    yn_mobile_verified: getUserByGoogleId.result.yn_mobile_verified, 
                    yn_email_verified: getUserByGoogleId.result.yn_email_verified, 
                    txt_active: getUserByGoogleId.result.txt_active
                });
                userobj = {
                    num_master_id: getUserByGoogleId.result.num_master_id, 
                    num_user_id: getUserByGoogleId.result.num_user_id, 
                    txt_user_id: getUserByGoogleId.result.txt_user_id, 
                    txt_gender: getUserByGoogleId.result.txt_gender, 
                    txt_user_dob: getUserByGoogleId.result.txt_user_dob, 
                    txt_emailid: getUserByGoogleId.result.txt_emailid,
                    num_mobile_no: getUserByGoogleId.result.num_mobile_no, 
                    txt_address_1: getUserByGoogleId.result.txt_address_1, 
                    txt_address_2: getUserByGoogleId.result.txt_address_2, 
                    num_pin_code: getUserByGoogleId.result.num_pin_code, 
                    dat_creation_date: getUserByGoogleId.result.dat_creation_date, 
                    first_name: getUserByGoogleId.result.first_name, 
                    last_name: getUserByGoogleId.result.last_name,
                    yn_mobile_verified: getUserByGoogleId.result.yn_mobile_verified, 
                    yn_email_verified: getUserByGoogleId.result.yn_email_verified, 
                    txt_active: getUserByGoogleId.result.txt_active,
                    txt_google_id: getUserByGoogleId.result.txt_google_id,
                    txt_profile_pic: getUserByGoogleId.result.txt_profile_pic,
                    token: token,
                }; 
                obj = {
                    status: "success",
                    message: "google login details",
                    response : userobj
                }; 
            }
           
        }
    } else {
        let message = required.map((item) => {
            return " " + item;
        });
        obj ={
            status: "fail",
            message: "Following fields are required for signing up - " + message,
        }
    }
    res.json(obj);
  });


module.exports = app1;