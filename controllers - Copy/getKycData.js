const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.post('/kyc_data', async (req, res, next) => {
    let obj;
    let required = [];
    if (!req.body.user_id) required.push("user_id");
    if (required.length === 0) {
        let num_user_id = req.body.user_id;

        let checkUser = await movieservices.findUserById(num_user_id);
        //console.log(checkUser);
        if (checkUser.status=="success") {
             let kyc_data_found=await movieservices.kyc_data(num_user_id);
             //console.log(kyc_data_found);
             
             if (kyc_data_found.status=="success") {
                obj={
                    status: "success",
                    message: "Kyc Data found!",
                    response: kyc_data_found.result
                };
            } else {
                obj = {
                    status: "fail",
                    message: "Kyc not found",
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
        
    } 
    res.json(obj);
})


module.exports = app1;

//SELECT ott_user_dtls.num_user_id, ott_kyc_dtls.txt_pancard_no
//FROM ott_user_dtls
//INNER JOIN ott_kyc_dtls ON ott_user_dtls.num_user_id = ott_kyc_dtls.num_user_id;