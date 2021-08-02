const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const sleep = require('util').promisify(setTimeout);
const movieservices = require('../services/movieServices');
var app1 = express();

var config = require('../config');
const base_url = config.base_url;

app1.get('/get_all_active_movie_list', async (req, res, next) => {
    let obj;
    let days = "";
    let moviedetails=await movieservices.findallActiveMovie2(days);
    if (moviedetails.status == 'success') {
        obj = {
            status: "success",
            message: "All Active Movie lists",
            response: moviedetails.result
        };
    } else {
        obj = {
            status: "fail",
            message: "list not found fsgsggsfg",
            response: ""
        };
    }
    res.json(obj);
})

module.exports = app1;