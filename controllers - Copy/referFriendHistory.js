const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const userservices = require('../services/userServices');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.post('/getReferFriendDetails', async (req, res, next) => {
    let obj;
    let required = [];
    if (!req.body.user_id) required.push("user_id");
    if (required.length === 0) {
        let master_user_id = req.body.user_id;

        let userDetails=await userservices.findChildReferByMasterId(master_user_id);
        //console.log(userDetails);
        if (userDetails.status == 'success') {
            obj = {
                status: "success",
                message: "User Found !",
                response: userDetails.result
            };
        } else {
            obj = {
                status: "fail",
                message: "No User found!",
                response: ""
            };
        }
        res.json(obj);
    }
    })
    module.exports = app1;