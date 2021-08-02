const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sleep = require('util').promisify(setTimeout);
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const sign = require("../services/jwt").sign;
const userservices = require('../services/userServices');
var app1 = express();
const addmail = require("../services/email");
const sms = require("../services/sms");
var config = require('../config');
const base_url = config.base_url;
const redirect_url =config.redirect_url; 
 

function now() {
  let curdate = new Date();
  return curdate.getTime() + curdate.getTimezoneOffset() * 60000;
}

const encrypt = text => {
  try {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
  } catch (error) {
    return 0;
  }
};

const decrypt = data => {
  try {
    return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return 0;
  }
};

//============ sms test =============
app1.post("/checkSMS", async (req, res) => {
  let required = [];
    if (!req.body.phone) required.push("phone");
    if (!req.body.otp) required.push("otp");
    let obj = {};
    if (required.length === 0) {
      let phoneWithCode = '91'+req.body.phone;
      console.log('phone===='+phoneWithCode);
      let sendContent = 'Your OTP is :'+req.body.otp;
      let resSMS = await sms.sendSMS91(phoneWithCode,sendContent);
    // console.log(resSMS);
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


//========= check email ==========================
app1.post("/checkemail", async (req, res) => {
  // console.log(base_url);return;
    let required = [];
    if (!req.body.email) required.push("email");
    let obj = {};
    if (required.length === 0) {
        let uservalueemail = {
            email: req.body.email
        }
        let getUserByEmail = await userservices.findUser(uservalueemail, "email");
        if (getUserByEmail) {
          if (getUserByEmail.status == "success") {
            delete getUserByEmail.result.txt_password;
            let date_ob = new Date();
            let date = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let hours = (date_ob.getHours() < 10) ? '0'+date_ob.getHours() : date_ob.getHours();
            let minutes = (date_ob.getMinutes() < 10) ? '0'+date_ob.getMinutes() : date_ob.getMinutes();
            let seconds = (date_ob.getSeconds() < 10) ? '0'+date_ob.getSeconds() : date_ob.getSeconds();
            let curdt = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

            let encvalue = getUserByEmail.result.num_user_id+'_'+curdt;
            var encv = encrypt(encvalue);
            let newurl = base_url+'api/verifyemail/'+encv;

            content = "<p>Dear "+getUserByEmail.result.first_name+",</p>";
            content += "<p>Click on the link to verify email : '" + newurl + "'</p>";
            emailobj = {
              to: req.body.email,
              content: content,
              subject: "verification email",
            };
            let resemil = await addmail.sendNewMail(emailobj);
            if (resemil.status == "success") {
                obj = { status: "success", message: "Email sent successfully", response:getUserByEmail.result };
            } else {
                obj = {
                    status: "fail",
                    message: "Sorry!email cannot send.",
                    response: ""
                };
            }
          }
          else {
              obj = {
                    status: "fail",
                    message: "The email you have entered does not exist",
                    response: ""
                };
          }
        }
        else {
            obj = {
                    status: "fail",
                    message: "The email you have entered does not exist",
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

//===== 
app1.get("/verifyemail/:encval", async (req, res) => {
    let required = [];
    if (!req.params.encval) required.push("encval");
    let obj = {};
    if (required.length === 0) {
        let encval = req.params.encval;
        var dv = decrypt(encval);
        if(dv != 0)
        {
            let exp_val = dv.split('_');
            let num_user_id = exp_val[0];
            let dt = exp_val[1];
            let uservaluebyid = {
                id: num_user_id
            }
            let getUserById = await userservices.findUser(uservaluebyid, "id");
              if (getUserById.status == "success") {
                let updateEmailverify = await userservices.updateEmailVerifyById(num_user_id);
                if (updateEmailverify.status == "success") {
                  console.log('redirect========'+redirect_url)
                  //res.json('success redirect');
                  //============ email ========================
                  let uemail = getUserById.result.txt_emailid;
                  content = "<p>Dear "+getUserById.result.first_name+",</p>";
                  content += "<p>You have successfully register</p>";
                  emailobj = {
                    to: uemail,
                    content: content,
                    subject: "Registration Successfull",
                  };
                  let resemil = await addmail.sendNewMail(emailobj);
                  res.redirect(redirect_url);
                }else{
                    obj = {
                        status: "fail",
                        message: "Sorry! cannot verify email"
                    };
                    res.json(obj);
                }
            } else {
                obj = {
                      status: "fail",
                      message: "User does not exist",
                      response: ""
                  };
                  res.json(obj);
            }
        }
        else
        {
            obj = {
                status: "fail",
                message: "Sorry! cannot verify email"
            };
            res.json(obj);
        }
    } else {
        let message = required.map((item) => {
            return " " + item;
        });
        obj = {
            status: "fail",
            message: "Following fields are required for signing up - " + message,
        };
        res.json(obj);
    }
  });

  app1.get("/verify_self_email_check", async (req, res) => {
    let required = [];
    let num_user_id;
    if (!req.body.num_user_id) required.push("num_user_id");
    let obj = {};
    if (required.length === 0) {
      let uservaluebyid = {
        id: req.body.num_user_id
    }
    let getUserById = await userservices.findUser(uservaluebyid, "id");
      if (getUserById.status == "success") {
        let updateEmailverify = await userservices.updateEmailVerifyById(num_user_id);
        if (updateEmailverify.status == "success") {
          obj = {
            status: "success",
            message: "Email is verified!",
            response: ""
        };
        }else{
            obj = {
                status: "fail",
                message: "Sorry! cannot verify email"
            };
            res.json(obj);
        }
    } else {
        obj = {
              status: "fail",
              message: "User does not exist",
              response: ""
          };
          res.json(obj);
    }
    } else {
        let message = required.map((item) => {
            return " " + item;
        });
        obj = {
            status: "fail",
            message: "Following fields are required for signing up - " + message,
        };
        res.json(obj);
    }
  });

  


module.exports = app1;