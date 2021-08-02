const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const userservices = require('../services/userServices');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.post('/getUserWalletBalanceById', async (req, res, next) => {
    let obj;
    let required = [];
    if (!req.body.user_id) required.push("user_id");
    if (required.length === 0) {
        let num_user_id = req.body.user_id;

        let userWalletDetails=await userservices.findUserWalletBalanceById(num_user_id);
       // console.log(userWalletDetails);
        if (userWalletDetails.status == 'success') {
            obj = {
                status: "success",
                message: "Wallet Balance",
                response: userWalletDetails.result
            };
        } else {
            obj = {
                status: "fail",
                message: "not user exist!",
                response: ""
            };
        }
        res.json(obj);
    }
    })
    module.exports = app1;