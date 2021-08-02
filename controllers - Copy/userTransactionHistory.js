const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.post('/userTransactionHistory', async (req, res, next) => {
    let obj;
    let required = [];
    if (!req.body.user_id) required.push("user_id");
    if (required.length === 0) {
        let num_user_id = req.body.user_id;

        let TransactionDetails=await movieservices.userTransactionDetails(num_user_id);
        //console.log(movieDetails);
        if (TransactionDetails.status == 'success') {
            obj = {
                status: "success",
                message: "Transaction Details Found!",
                response: TransactionDetails.result
            };
        } else {
            obj = {
                status: "fail",
                message: "not found",
                response: ""
            };
        }
        res.json(obj);
    }
    })
    module.exports = app1;