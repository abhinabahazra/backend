const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const userservices = require('../services/userServices');
const addmail = require("../services/email");
var app1 = express();

var config = require('../config');
const { waitForDebugger } = require('inspector');
const { ok } = require('assert');
const { networkInterfaces } = require('os');
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

/// add test ======

app1.post('/user_refer', async (req, res, next) => {
    let ref = await userservices.getRefer('158');
    console.log(ref);
});

//=============== user registration ==========
app1.post('/user_signup', async (req, res, next) => {
    // console.log('hello123');
    // return;
  let obj;
  let required = [];
  let emailFlag = 1;
  let phoneFlag = 1;
  let submitFlag = 0;
  let gender = "";
  let usertype = 3;
  let joincode = "";
  let refstat = 1;
  let ref_message = "";
  let getUser=[];
  let credit_amt=0;
  let debit_amt=0;
  let balance_amt=0;
  let transaction_no=0;

  // console.log(req.body);
  // return;

  if (!req.body.type) required.push("type");
  if (!req.body.first_name) required.push("first_name");
  if (!req.body.last_name) required.push("last_name");
  if (!req.body.password) required.push("password");
  if (!req.body.usertype) required.push("usertype");
  if (!req.body.user_country) required.push("user_country");

  if(req.body.usertype && req.body.usertype == "2")
  {
    if (!req.body.email) required.push("email");
    if (!req.body.phone) required.push("phone");
  }
  else
  {
      if (!req.body.email) required.push("email");
  }

  if (required.length === 0) {
      let type = req.body.usertype;
      let email = "";
      let phone = "";
      if(req.body.usertype)
      {
        usertype = req.body.usertype;
      }
      if(req.body.joining_code != "")
      {
        let uservalueemail = {
          refercode: req.body.joining_code 
      }

        
        let getUserByRefer = await userservices.findUser(uservalueemail, "refer");
        if (getUserByRefer.status == "success") {
          joincode = req.body.joining_code;
        } else {
          refstat = 0;
          joincode = "";
        }
        
      }

        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        let finaldt = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

          if(req.body.email)
          {
              email = req.body.email;
              let uservalueemail = {
                  email: req.body.email
              }
              let getUserByEmail = await userservices.findUser(uservalueemail, "email");
              if (getUserByEmail) {
                if (getUserByEmail.status == "success") {
                    emailFlag = 0;
                    obj = { status: "fail", message: "email already exist", response: "" };
                }
                else {
                    emailFlag = 1;
                }
              }
              else {
                  emailFlag = 1;
              }
          }
          //=================================================
          if(req.body.phone)
          {
              phone = req.body.phone;
              let uservaluephone = {
                  phone: req.body.phone
              }
              let getUserByPhone = await userservices.findUser(uservaluephone, "phone");
              if (getUserByPhone.status == "success") {
                  phoneFlag = 0;
                  obj = { status: "fail", message: "phone already exist", response: "" };
              }
              else {
                  phoneFlag = 1;
              }
          }
          //=================================================
          if (emailFlag == 1 && phoneFlag == "1") {
            let userobj = {
              num_master_id: usertype,
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              txt_user_id: email,
              txt_password: req.body.password,
              txt_gender: gender,    
              txt_emailid: email,
              num_mobile_no: phone,
              txt_user_country: req.body.user_country,
              dat_creation_date: finaldt,
              txt_active: "1",
              txt_joining_code:joincode
          };

 
              if(refstat == 1)
              {
                 getUser = await userservices.addUser(userobj);
                    let walletobj={
                      num_user_id:getUser.result.num_user_id,
                      txt_user_id: getUser.result.txt_user_id,
                      cur_credit_amount:credit_amt,
                      cur_debit_amount:debit_amt,
                      cur_balance_amount:balance_amt,
                      txt_transaction_no:transaction_no,
                      dat_update_date:userobj.dat_creation_date
                  };
                      let walletUser= await userservices.addUserWallet(walletobj);
                      if (getUser.status == "success") {
                        let checkUserByJoining= await userservices.findUserByJoiningCode(joincode);
                        if (checkUserByJoining.status == "success") {
                            let newinserobj = {
                              num_user_id: getUser.result.num_user_id,
                              txt_user_id: getUser.result.txt_user_id,
                              master_user_id: checkUserByJoining.result.num_user_id,
                              master_txt_user_id:checkUserByJoining.result.txt_user_id ,
                              dat_creation_date: finaldt
                            }
                            let getReferUser = await userservices.addReferUser(newinserobj);
                        }
                        //=================== refer code generation ====================
                        let userid = getUser.result.num_user_id;
                        let ref = await userservices.getRefer(userid);
                        let getUser2 = await userservices.findUser({id:userid}, "id");
                        delete getUser2.result.txt_password;  

                        obj = { status: "success",
                         message: "User registration successfully",
                         title: "Success",
                         text: "User registration successfully",
                         icon: "success",
                          response:getUser2.result };
                        // //================check refer code==============
                        
                        //============ email ========================
                        if (req.body.email) {
                          let encvalue = getUser.result.num_user_id+'_'+finaldt;
                          var encv = encrypt(encvalue);
                          let newurl = base_url+'api/verifyemail/'+encv;
                          content = "<p>Dear "+getUser.result.first_name+",</p>";
                          content += "<p>Click on the link to verify email : '" + newurl + "'</p>";
                          emailobj = {
                            to: req.body.email,
                            content: content,
                            subject: "verification email",
                          };
                          let resemil = await addmail.sendNewMail(emailobj);
                        }
                }
                else
                {
                  obj = {status: "fail", message: "Sorry! An unknown error occurred" };
                }
                  //=============================================================
              } else {
                if(refstat == 0)
                {
                  obj = { status: "fail",
                   message: "refer code not exist",
                   title: "Failed",
                   text:"refer code not exist",
                   icon: "error",
                    response: "" };
                }
                else
                {
                  obj = {status: "fail",
                   message: "Sorry! An unknown error occurred",
                   title: "Failed",
                   text:"Sorry! An unknown error occurred",
                   icon: "error", };
                }
              }
          } else {
            console.log('error flag 000');
                if (emailFlag == 0 && phoneFlag == 0){
                    obj = {
                      status: "fail",
                      message: "Sorry! email and phone already exist",
                      title: "Failed",
                   text:"Sorry! email and phone already exist",
                   icon: "error",
                  };
                }else if (emailFlag == 0){
                  obj = {
                      status: "fail",
                      message: "Sorry! email already exist",
                      title: "Failed",
                   text:"Sorry! email already exist",
                   icon: "error",
                  };
                }else if (phoneFlag == 0){
                  obj = {
                      status: "fail",
                      message: "Sorry! phone already exist",
                      title: "Failed",
                   text:"Sorry! phone already exist",
                   icon: "error",
                  };
                }
          }
  } else {
      let message = required.map((item) => {
          return " " + item;
      });
      obj = {
          status: "fail",
          message: "Following fields are required for signing up - " + message,
          title: "Failed",
          text: "Following fields are required for signing up - " + message,
          icon: "error",
      };
  }
  res.json(obj);
});


module.exports = app1;