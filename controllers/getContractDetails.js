const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
//const movieservices = require('../user_service/movieService');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.get('/get_contract_details', async (req, res, next) => {
    let obj;

    let contractdetails=await movieservices.contract_details();
    if (contractdetails.status == 'success') {
        obj = {
            status: "success",
            message: "Contract Data!",
            response: contractdetails.result
        };
    } else {
        obj = {
            Admin: "30",
            Producer: "70",
            response: "Thanks for Visiting!"
        };
    }
    res.json(obj);
})

module.exports = app1;