const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const userservices = require('../services/userServices');
const addmail = require("../services/email");
const bcrypt = require('bcrypt');
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
app1.post('/change_password_id', async (req, res) => {
    //console.log('hello');
    let obj;
    let required = [];

    if (!req.body.num_user_id) required.push("num_user_id");
    if (!req.body.new_password) required.push("new_password");
    if (!req.body.old_password) required.push("old_password");

    if (required.length === 0) {
        let newpassword = req.body.new_password;
        let oldpassword = req.body.old_password;
        let uservalueId = {
            id: req.body.num_user_id
        }
        let getUserById = await userservices.findUser(uservalueId, "id");
            if (getUserById.status == "success") {
                //===========old password matched ================
                let match = bcrypt.compareSync(oldpassword, getUserById.result.txt_password);
                if (match) {
                    let updateduser = await userservices.editUserPassword(getUserById.result.num_user_id,newpassword);
                    if (updateduser.status == "success")
                        {
                        obj = { 
                            status: "success",
                                message: "Password updated successfully",
                                title: "Success",
                                text: "Password Updated successfully.",
                                icon: "success",
                                response: ""
                            };
                    } else {
                        obj = {
                            status: "fail",
                            message: "Sorry! An unknown error occurred",
                            title: "Failed",
                            text: "Error in changing password",
                            icon: "error",
                        };
                    }
                } else {
                    obj = { 
                        status: "fail", 
                        message: "old password not matched", 
                        response: "" ,
                        title: "Failed",
                        text: "old password not matched",
                        icon: "error",
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