const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const userservices = require('../services/userServices');
const addmail = require("../services/email");
const upload = require("../upload_services/upload_profile_pic");
var app1 = express();

var config = require('../config');
const base_url = config.base_url;
let image_path = "upload/image/";
let video_path = "upload/video/";
let certificate_path = "upload/document/";


const encrypt = text => {
    try {
      return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
    } catch (error) {
      return 0;
    }
  };

//=============== User Profile Update  ==========
app1.post('/update_profile', async (req, res, next) => {
    let obj; 
    let required = [];
    let yn_email_verified = "";

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let finaldt = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

    if (!req.body.user_id) required.push("user_id");

    if (required.length === 0) {
        let num_user_id = req.body.user_id;

        let checkUser = await userservices.findUserById(num_user_id);
        //console.log(checkUser);
        let email_flag = 0;
        //console.log(checkUser.result.txt_emailid+'                        '+req.body.email);
        if (checkUser.result.txt_emailid != req.body.email) {
            yn_email_verified = "0";
            email_flag = 1;
        } else  {
            yn_email_verified = checkUser.result.yn_email_verified;
          
        }
        if (checkUser.status == "success") {

            let userobj = {
                num_user_id : req.body.user_id,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                txt_emailid: req.body.email,
                num_mobile_no: req.body.phone,
                txt_user_dob: req.body.dateofbirth,    
                txt_gender: req.body.gender,
                txt_address_1: req.body.first_address,
                txt_address_2: req.body.second_address,
                num_pin_code: req.body.pin_code,
                txt_profile_pic:req.body.profile_image,
                yn_email_verified: yn_email_verified
            };
            //console.log(userobj);
            let updateProfile = await userservices.updateProfile(userobj,num_user_id);
            //console.log(updateProfile);
            if (updateProfile.status == "success") {
                obj = {
                    status: "success",
                    message: "Profile Updated successfully.",
                    title: "Success",
                    text: "Profile Updated successfully.",
                    icon: "success",
                    response:updateProfile.result 
                    };
                    //============ email ========================
                    if (email_flag == 1) {
                        let encvalue = num_user_id+'_'+finaldt;
                        var encv = encrypt(encvalue);
                        let newurl = base_url+'api/verifyemail/'+encv;
                        //content = "<p>Dear "+updateProfile.result.first_name+",</p>";
                        content = "<p>Dear Subscriber,</p>";
                        //console.log(updateProfile);
                        content += "<p>Click on the link to verify email : '" + newurl + "'</p>";
                        emailobj = {
                        to: req.body.email,
                        content: content,
                        subject: "verification email",
                        };
                        let resemil = await addmail.sendNewMail(emailobj);
                    }
                  //=============================================================
            } else {
                obj = {
                    status: "fail",
                    message: "Sorry! An unknown error occurred",
                    response: "",
                    message: "Sorry! An unknown error occurred",
                    title: "Failed",
                    text: "Error in Profile Updation!",
                    icon: "error",
                };
            }

        } else {
            obj = {
                status: "fail",
                message: "Sorry! no user by this id",
                response: ""
            };
        }
    } else {
        let message = required.map((item) => {
            return " " + item;
        });
        obj = {
            status: "fail",
            message: "Following fields are required for update - " + message,
        };
    }
    res.json(obj);
})

app1.post('/upload_ProfilePic', async (req, res) => {
    let obj;
  
    try {
          let upimg = await upload(req, res);
          //console.log(req.files);
          //console.log(req.body);
        
      let checkUser = await userservices.findUserById(req.body.num_user_id);
      if (checkUser.status == "success") {
          //let getMovieLink = await movieservices.findMovieLinkById(req.body.num_movie_id);
        if (req.files.length > 0 && req.body.num_user_id != "") {
          let user = {
             num_user_id: req.body.num_user_id,
             col_value: image_path+ req.files[0].filename,
             col_name: "txt_profile_pic",
          };
          let getUser = await userservices.updateProfilePic(user);
          obj = {
              status: "Success",
              message: "Files has been uploaded.",
              response: ""
          };
          return res.send(obj);
        }
        else{
          obj = {
              status: "fail",
              message: "You must select at least 1 file.",
              response: ""
          };
          return res.send(obj);
        }
      } else {
        obj = {
            status: "fail",
            message: "Sorry! no movie by this id",
            response: ""
        };
        return res.send(obj);
    }
    } catch (error) {
      console.log(error);
  
      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return res.send("Too many files to upload.");
      }
      return res.send(`Error when trying upload many files: ${error}`);
    }
  });
module.exports = app1;
