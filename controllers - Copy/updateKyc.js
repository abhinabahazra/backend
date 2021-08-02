const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
const upload = require("../upload_services/upload_kyc_pan");
const upload_cheque = require("../upload_services/upload_kyc_cheque");
var app1 = express();

var config = require('../config');
const base_url = config.base_url;
let image_path = "upload/image/";
let video_path = "upload/video/";
let certificate_path = "upload/document/";



//=============== User kyc Update  ==========
app1.post('/update_kyc', async (req, res, next) => {
    let obj; 
    let required = [];

    if (!req.body.user_id) required.push("user_id");

    if (required.length === 0) {
        let num_user_id = req.body.user_id;

        let checkUser = await movieservices.findUserById(num_user_id);
        //console.log(checkUser);
        if (checkUser.status == "success") {

            let userobj = {
                txt_pancard_no : req.body.pancard_no,
                txt_pancard_link: req.body.pancard_link,
                account_no: req.body.account_no,
                ifsc_code: req.body.ifsc_code,
                txt_bank_name: req.body.bank_name,
                txt_branch_name: req.body.branch_name,    
                txt_cheque_link: req.body.cheque_link,
            };
            //console.log(userobj);
            let updatekycdata = await movieservices.updateKycData(userobj,num_user_id);
            console.log(updatekycdata);
            if (updatekycdata.status == "success") {
                obj = {
                    status: "success",
                    message: "kyc Updated successfully",
                    response:updatekycdata.result 
                    };
                    
            } else {
                obj = {
                    status: "fail",
                    message: "Sorry! An unknown error occurred",
                    response: ""
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

// Upload Pan Image
app1.post('/upload_PanImage', async (req, res) => {
    let obj;
  
    try {
          let upimg = await upload(req, res);
          //console.log(req.files);
          //console.log(req.body);
        
      let checkUser = await movieservices.findUserById(req.body.num_user_id);
      if (checkUser.status == "success") {
          //let getMovieLink = await movieservices.findMovieLinkById(req.body.num_movie_id);
        if (req.files.length > 0 && req.body.num_user_id != "") {
          let user = {
             num_user_id: req.body.num_user_id,
             col_value: image_path+ req.files[0].filename,
             col_name: "txt_pancard_link",

          };
          console.log(user);
          let getUser = await movieservices.updateKycPan(user);
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
            message: "Sorry! no user is found by this id",
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

// Upload cheque Image
app1.post('/upload_ChequeImage', async (req, res) => {
    let obj;
  
    try {
          let upimg = await upload_cheque(req, res);
          //console.log(req.files);
          //console.log(req.body);
        
      let checkUser = await movieservices.findUserById(req.body.num_user_id);
      if (checkUser.status == "success") {
          //let getMovieLink = await movieservices.findMovieLinkById(req.body.num_movie_id);
        if (req.files.length > 0 && req.body.num_user_id != "") {
          let user = {
            num_user_id: req.body.num_user_id,
            col_value: image_path+ req.files[0].filename,
            col_name: "txt_cheque_link",

          };
          let getUser = await movieservices.updateKycCheque(user);
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
            message: "Sorry! no user is found by this id",
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
