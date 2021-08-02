const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.post('/add_kyc_data', async (req, res, next) => {
    let obj;
    let required = [];
    
    
    if (!req.body.user_id) required.push("user_id");
    if (!req.body.pancard_no) required.push("pancard_no");

    if (required.length === 0) {
        let num_user_id = req.body.user_id;
    
        let checkUser = await movieservices.findUserById(num_user_id);
        // console.log(checkUser);
        // return;
        if (checkUser.status == "success") {
            //======================================================
            let checkKyc = await movieservices.findUserKycById(num_user_id);
            // console.log(checkKyc);
            // return;

            if (checkKyc.status == "fail") {
                //================== insert ==========================
                let userobj = {
                    num_user_id: req.body.user_id,
        
                    txt_pancard_no:req.body.pancard_no,
                    txt_pancard_link:req.body.pancard_link,
                    account_no:req.body.account_no,
                    ifsc_code:req.body.ifsc_code,
                    txt_bank_name:req.body.bank_name,
                    txt_branch_name:req.body.branch_name,
                    txt_cheque_link:req.body.cheque_link,
        
                };
                let addKycData = await movieservices.add_kyc_data(userobj);
                // console.log(addKycData);
                // return;
                if (addKycData.status == "success") {
                    obj = {
                        status: "success",
                        message: "New KYC is added successfully!",
                        response:addKycData.result 
                        };
                
                } else {
                    obj = {
                        status: "fail",
                        message: "Sorry! An unknown error occurred",
                        response: ""
                    };
                }
            } else {
                //================= update ===================
                let userobj = {
                    num_user_id: req.body.user_id,
        
                    txt_pancard_no:req.body.pancard_no,
                    txt_pancard_link:req.body.pancard_link,
                    account_no:req.body.account_no,
                    ifsc_code:req.body.ifsc_code,
                    txt_bank_name:req.body.bank_name,
                    txt_branch_name:req.body.branch_name,
                    txt_cheque_link:req.body.cheque_link,
        
                };
                // console.log(userobj);
                // return;
                let updateKycData = await movieservices.updateKycData(userobj,num_user_id);
                // console.log(updateKycData);
                // return;
                if (updateKycData.status == "success") {
                    obj = {
                        status: "success",
                        message: "User Kyc is update successfully",
                        response:updateKycData.result 
                        };
                
                } else {
                    obj = {
                        status: "fail",
                        message: "Sorry! An unknown error occurred",
                        response: ""
                    };
                }
                
            }

            //======================================================
        } else {
            obj = {
                status: "fail",
                message: "Sorry! no User is found by this id",
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
})
module.exports = app1;
