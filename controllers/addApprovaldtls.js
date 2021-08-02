const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const adminservices = require('../services/adminServices');
const movieservices = require('../services/movieServices');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.post('/add_approval', async (req, res, next) => {
    let obj;
    let required = [];
    
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let finaldt = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    
    if (!req.body.movie_id) required.push("movie_id");

    if (required.length === 0) {
        let num_movie_id = req.body.movie_id;
        let num_user_id = req.body.upload_id;
        let id=req.body.approval_type;

        let checkMovie = await adminservices.findMovieById(num_movie_id);
        let checkUser = await adminservices.findUserById(num_user_id);
        let checkApproval=await adminservices.findApprovalById(id);
        //console.log(checkMovie);
        //console.log(checkUser);
        //return;

        if (checkMovie.status == "success" && checkUser.status=="success" && checkApproval.status=="success" ) {

            let approvalobj = {
                num_approval_type:req.body.approval_type,
                num_movie_id: req.body.movie_id,
               // num_user_id:req.body.user_id,
                //txt_approval_status:req.body.approval_status,
                txt_desc: req.body.description,
                approved_by_id:req.body.approved_by_id,
                dat_approval_date:finaldt,
                upload_id: req.body.upload_id,
                upload_date:finaldt,
            };
            //console.log(approvalobj);

            let checkApproval=await movieservices.checkExistingMovieInApprovalDtls(num_movie_id,num_user_id,id);
            //console.log(checkApproval);
           // return;
            if (checkApproval.status == "fail") {
                let addApprovalDtls = await adminservices.add_approval_dtls(approvalobj);
                //console.log(addApprovalDtls);
                if (addApprovalDtls.status == "success") {
                    obj = {
                        status: "success",
                        message: "Approval Added successfully",
                        response:addApprovalDtls.result 
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
                    message: "Sorry! Already inserted data!",
                    response: ""
                };
            }  
        } else {
            obj = {
                status: "fail",
                message: "Sorry! no movie or user id not found by this id",
                //response: ""
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
})
module.exports = app1;
