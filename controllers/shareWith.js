const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
const userservices = require('../services/userServices');
const addmail = require("../services/email");
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.post('/share_with', async (req, res, next) => {
    let obj,content;
    let required = [];
    let sent_content = "";
    if (!req.body.num_user_id) required.push("num_user_id");
    if (!req.body.sent_email) required.push("sent_email");
    // if(req.body.sent_content != "")
    // {
    //     sent_content = req.body.sent_content;
    // }
    if (required.length === 0) {
        let uservalueid = {
            id: req.body.num_user_id
        }
        let getUserByid = await userservices.findUser(uservalueid, "id");
        if (getUserByid.status == "success") {
             //============ email ========================
             sent_content = getUserByid.result.txt_refer_code;
             let full_name = getUserByid.result.first_name+' '+getUserByid.result.last_name;
             if (req.body.sent_email && req.body.sent_email != getUserByid.result.txt_emailid) {
                content = "<p>Hi,</p>";
                content += "<p>I invite you to join Digi Movieplex(The Digital Multiplex). </p>";
                content += "<p>1) Visit the website https://www.digimovieplex.com/.</p>";
                content += "<p>2) Sign up using my refer code  "+sent_content+".</p>";
                content += "<p>3) Start watching movies.</p>";
                content += "<p></p>";
                content += "<p>Thanks</p>";

                emailobj = {
                    from: getUserByid.result.txt_emailid,
                    to: req.body.sent_email,
                    content: content,
                    subject: "Digi Movieplex Refer Code",
                };
                let resemil = await addmail.sendNewMail(emailobj);
                // console.log(resemil);
                if (resemil.status == "success") {
                    obj = {
                        status: "success",
                        message: "Share with "+req.body.sent_email,
                    };
                } else {
                    obj = {
                        status: "fail",
                        message: "Sorry! email not found.",
                    };
                }
              } else {
                obj = {
                    status: "fail",
                    message: "Sorry! email not found.",
                };
              }
              
              //=============================================================
        } else {
            obj = {
                status: "fail",
                message: "Sorry! user not found.",
            };
        }

    }else {
        let message = required.map((item) => {
            return " " + item;
        });
        obj = {
            status: "fail",
            message: "Following fields are required for signing up - " + message,
        };
    }
    res.json(obj);

    })
    module.exports = app1;