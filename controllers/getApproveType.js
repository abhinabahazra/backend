const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const adminservices = require('../services/adminServices');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.get('/approve_list', async (req, res, next) => {
    let obj;
    let list=await adminservices.all_approve_type();
    if (list.status == 'success') {
        obj = {
            status: "success",
            message: "Approve list",
            response: list.result
        };
    } else {
        obj = {
            status: "fail",
            message: "list not found",
            response: ""
        };
    }
    res.json(obj);
})

module.exports = app1;