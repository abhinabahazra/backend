const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.get('/movie_language_list', async (req, res, next) => {
    let obj;
    let list=await movieservices.all_user();
    if (list.status == 'success') {
        obj = {
            status: "success",
            message: "language list",
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