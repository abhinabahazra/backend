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
const link = config.password_link;


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
app1.post('/forgot_password_link', async (req, res) => {
    //console.log('hello');
    let obj;
    let required = [];
    if (!req.body.user_email) required.push("user_email");
    if (required.length === 0) {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        let finaldt = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

        let uservalueemail = {
            email: req.body.user_email
        }

        let getUserByEmail = await userservices.findUser(uservalueemail, "email");
            if (getUserByEmail.status == "success") {
                //============ email ========================
                obj = { 
                    status: "success",
                     message: "Forgot password link sent successfully",
                     response: ""
                    };
                    
                if (uservalueemail.email) {
                    let encvalue = getUserByEmail.result.num_user_id;
                    var encv = encrypt(encvalue);
                    let newurl = link  + encv;
                    content = "<p>Dear "+getUserByEmail.result.first_name+",</p>";
                    content += "<p>Click on the link for password : '" + newurl + "'</p>";
                    emailobj = {
                      to: uservalueemail.email,
                      content: content,
                      subject: "forgot password",
                    };
                    // console.log(emailobj);
                    let resemil = await addmail.sendNewMail(emailobj);
                  }
                  //=============================================================
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