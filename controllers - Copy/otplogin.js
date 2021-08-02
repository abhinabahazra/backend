const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sleep = require('util').promisify(setTimeout);
const jwt = require('jsonwebtoken');
const sign = require("../services/jwt").sign;
const userservices = require('../services/userServices');
var app1 = express();

//========= otp send ============
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('220681Ap3YnI61Qsx5b237012');


function now() {
  let curdate = new Date();
  return curdate.getTime() + curdate.getTimezoneOffset() * 60000;
}


//========= sign-in ==========================
app1.post("/otp_check", async (req, res) => {
    let userobj,obj;
    let required = [];

    if (!req.body.mobile) required.push("mobile");
    
    if (required.length === 0) {
        let uservaluephone = {
            phone: req.body.mobile
        }
        //console.log(uservaluephone);return;
        let getUserByPhone = await userservices.findUser(uservaluephone, "phone");
        // console.log(getUserByPhone);
        //return;
        if (getUserByPhone.status == "success") {
            delete getUserByPhone.result.txt_password;
            token = sign({ 
                num_user_id: getUserByPhone.result.num_user_id, 
                num_master_id: getUserByPhone.result.num_master_id, 
                txt_user_id: getUserByPhone.result.txt_user_id, 
                num_mobile_no: getUserByPhone.result.num_mobile_no, 
                first_name: getUserByPhone.result.first_name, 
                last_name: getUserByPhone.result.last_name,
                txt_active: getUserByPhone.result.txt_active
            });
            getUserByPhone.result.token = token;
            obj = { status: "success", message: "Login successfully",response: getUserByPhone.result }
        } else {
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
                first_name: "Guest",
                last_name: "User",
                txt_user_id: req.body.mobile,
                txt_password: "Guest@123",
                txt_gender: "",    
                txt_emailid: "",
                num_mobile_no: req.body.mobile,
                dat_creation_date: finaldt,
                yn_mobile_verified: "1",
                txt_active: "1"
            };
            let getUser = await userservices.addUser(userobj);
            delete getUser.result.txt_password;
            token = sign({ 
                num_user_id: getUser.result.num_user_id, 
                num_master_id: getUser.result.num_master_id, 
                txt_user_id: getUser.result.txt_user_id, 
                num_mobile_no: getUser.result.num_mobile_no, 
                first_name: getUser.result.first_name, 
                last_name: getUser.result.last_name,
                txt_active: getUser.result.txt_active
            });
            getUser.result.token = token;
            obj = { status: "success", message: "Login successfully",response: getUser.result }
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


  app1.post("/otp_sent", async (req, res) => {
    let userobj;
    let required = [];
    let OTP = Math.floor(1000 + Math.random() * 9999);
    if (!req.body.mobile) required.push("mobile");
    let obj = {};
    if (required.length === 0) {
            let phone = req.body.mobile;
            let senderId = "IIESTS";
            let otp = OTP;
            let resSMS = sendOtp.send(phone, senderId, otp, function (error, data) {
                if(data.type == 'success') res.json({ status: "success", message: "OTP sent successfully",response: { otp:OTP } });
                if(data.type == 'error') res.json({ status: "fail", message: "OTP cannot sent" });
            });      
    } else {
        let message = required.map((item) => {
            return " " + item;
        });
        res.json({
            status: "fail",
            message: "Following fields are required for signing up - " + message,
        });
    }
    // res.json(obj);
  });

module.exports = app1;