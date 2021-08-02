const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const userservices = require('../services/userServices');
const movieservices = require('../services/movieServices');
const addmail = require("../services/email");
var app1 = express();



app1.post('/give_feedback', async (req, res) => {
    let obj;
    let required = [];
    if (!req.body.user_email) required.push("user_email");
    if (!req.body.user_feedback) required.push("user_feedback");
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
               //====================================
               let getFeedback = await movieservices.check_user_feedback(getUserByEmail.result.txt_emailid);
               if (getFeedback.status == "success") {
                  obj = {
                    status: "fail",
                    message: "Sorry! feedback already given.",
                    response: ""
                };
               } else {
                 //================ insert =================
                let feedbackobj = {
                    txt_name: getUserByEmail.result.first_name+' '+getUserByEmail.result.last_name,
                    txt_emailid: getUserByEmail.result.txt_emailid,
                    num_mobile_no: getUserByEmail.result.num_mobile_no,
                    txt_feedback: req.body.user_feedback,
                    dat_feedback_date: finaldt
                };
              let giveFeedback = await movieservices.add_user_feedback(feedbackobj);
              if (giveFeedback.status == "success") {
                  obj = {
                      status: "success",
                      message: "feedback given successfully",
                      response: giveFeedback.result 
                      };
              
              } else {
                  obj = {
                      status: "fail",
                      message: "Sorry! An unknown error occurred",
                      response: ""
                  };
              }
              //===================== insert end ================
               }
               //====================================
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



app1.post('/user_feedback', async (req, res) => {
    let obj;
    let required = [];
    let txt_emailid = "";

    if (!req.body.first_name) required.push("first_name");
    if (!req.body.last_name) required.push("last_name");
    if (!req.body.phone) required.push("phone");
    if (!req.body.feedback) required.push("feedback");

    if (required.length === 0) {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        let finaldt = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

        if (req.body.txt_emailid) {
            txt_emailid = req.body.txt_emailid;
        }

        let getFeedback = await movieservices.check_user_feedback(req.body.phone);
        if (getFeedback.status == "success") {
           obj = {
             status: "fail",
             message: "Sorry! feedback already given.",
             response: ""
         };
        } else {
        //================ insert =================
        let feedbackobj = {
            txt_name: req.body.first_name+' '+req.body.last_name,
            txt_emailid: txt_emailid,
            num_mobile_no: req.body.phone,
            txt_feedback: req.body.feedback,
            dat_feedback_date: finaldt
        };
        
              let giveFeedback = await movieservices.add_user_feedback(feedbackobj);
              if (giveFeedback.status == "success") {
                  obj = {
                      status: "success",
                      message: "feedback given successfully",
                      response: giveFeedback.result 
                      };
              
              } else {
                  obj = {
                      status: "fail",
                      message: "Sorry! An unknown error occurred",
                      response: ""
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
        };
    }
    res.json(obj);
});


module.exports = app1;