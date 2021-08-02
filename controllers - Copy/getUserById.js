const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.post('/getUserById', async (req, res, next) => {
    let obj;
    let required = [];
    if (!req.body.user_id) required.push("user_id");
    if (required.length === 0) {
        let num_user_id = req.body.user_id;

        let userDetails=await movieservices.findUserById(num_user_id);
        delete userDetails.result.txt_password;  
        //console.log(movieDetails);
        if (userDetails.status == 'success') {
            obj = {
                status: "success",
                message: "User Found",
                response: userDetails.result
            };
        } else {
            obj = {
                status: "fail",
                message: "User not found!",
                response: ""
            };
        }
        res.json(obj);
    }
    })
    module.exports = app1;